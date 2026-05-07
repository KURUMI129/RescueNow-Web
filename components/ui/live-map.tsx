"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import { useTheme } from "@/components/theme/theme-provider";
import { distanceKm, fetchPOIs, SERVICES, type POI } from "@/lib/overpass";

const MAP_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const MAP_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const RADIUS_METERS = 8000;

function userIcon(color: string) {
  const html = `
    <div style="position:relative;width:22px;height:22px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};box-shadow:0 0 0 6px ${color}33, 0 0 18px ${color}88;"></div>
      <div style="position:absolute;inset:6px;border-radius:50%;background:#fff;"></div>
    </div>`;
  return L.divIcon({
    html,
    className: "rn-user-icon",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function poiIcon(color: string, emoji: string) {
  const html = `
    <div style="position:relative;width:34px;height:42px;transform:translateY(-8px);">
      <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:32px;height:32px;border-radius:50%;background:${color};box-shadow:0 4px 12px ${color}99, 0 0 0 3px #fff;display:flex;align-items:center;justify-content:center;font-size:16px;">${emoji}</div>
      <div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:${color};"></div>
    </div>`;
  return L.divIcon({
    html,
    className: "rn-poi-icon",
    iconSize: [34, 42],
    iconAnchor: [17, 42],
  });
}

function MapBridge({
  lat,
  lng,
  onReady,
}: {
  lat: number;
  lng: number;
  onReady: (map: L.Map) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
    const t = setTimeout(() => map.invalidateSize(), 120);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [map, onReady]);
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: false });
  }, [lat, lng, map]);
  return null;
}

export default function LiveMap() {
  const { resolved } = useTheme();
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [permission, setPermission] =
    useState<"idle" | "asking" | "granted" | "denied">("idle");
  const [active, setActive] = useState<string>("gas");
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPermission("denied");
      setPos({ lat: 19.4326, lng: -99.1332 });
      return;
    }
    setPermission("asking");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setPermission("granted");
      },
      () => {
        setPermission("denied");
        setPos({ lat: 19.4326, lng: -99.1332 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const centerOnUser = useCallback(() => {
    if (!pos || !mapRef.current) return;
    mapRef.current.flyTo([pos.lat, pos.lng], 13, { duration: 0.7 });
  }, [pos]);

  useEffect(() => {
    if (!pos) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    fetchPOIs(pos.lat, pos.lng, active, RADIUS_METERS, ctrl.signal)
      .then((list) => {
        if (ctrl.signal.aborted) return;
        setPois(list.slice(0, 30));
        setLoading(false);
        if (mapRef.current) {
          mapRef.current.flyTo([pos.lat, pos.lng], 13, { duration: 0.6 });
        }
      })
      .catch(() => {
        if (ctrl.signal.aborted) return;
        setPois([]);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [active, pos]);

  const tileUrl = resolved === "dark" ? MAP_DARK : MAP_LIGHT;
  const activeSvc = useMemo(
    () => SERVICES.find((s) => s.id === active)!,
    [active],
  );

  if (!pos) {
    return (
      <div
        className="relative h-full w-full flex items-center justify-center"
        style={{
          background: resolved === "dark" ? "#080C16" : "#F1F5F9",
          minHeight: 320,
        }}
      >
        <div className="text-center text-sm text-light-muted dark:text-dark-muted">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-crimson border-t-transparent" />
          {permission === "asking"
            ? "Pidiendo permiso de ubicación..."
            : "Localizando..."}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={{ minHeight: 320 }}>
      <MapContainer
        center={[pos.lat, pos.lng]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{
          height: "100%",
          width: "100%",
          background: resolved === "dark" ? "#080C16" : "#F8FAFC",
        }}
      >
        <TileLayer
          key={tileUrl}
          attribution='&copy; OpenStreetMap · CARTO'
          url={tileUrl}
          subdomains={["a", "b", "c", "d"]}
          maxZoom={19}
        />
        <MapBridge
          lat={pos.lat}
          lng={pos.lng}
          onReady={(m) => {
            mapRef.current = m;
          }}
        />
        <Marker position={[pos.lat, pos.lng]} icon={userIcon("#0EA5E9")}>
          <Popup>Estás aquí</Popup>
        </Marker>
        {pois.map((p) => {
          const d = distanceKm(pos.lat, pos.lng, p.lat, p.lng);
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={poiIcon(activeSvc.color, activeSvc.icon)}
            >
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                  {d.toFixed(1)} km
                </div>
                <a
                  style={{
                    fontSize: 12,
                    color: activeSvc.color,
                    fontWeight: 700,
                    marginTop: 6,
                    display: "inline-block",
                  }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Navegar →
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center gap-2 overflow-x-auto pb-1 mask-fade-edges">
        {SERVICES.map((s) => {
          const a = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex-none flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: a ? s.color : "rgba(11,17,32,0.75)",
                color: "#fff",
                boxShadow: a ? `0 8px 20px -6px ${s.color}aa` : "none",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={centerOnUser}
        aria-label="Centrar en mi ubicación"
        className="absolute bottom-14 right-3 z-[400] h-11 w-11 rounded-full bg-white text-brand-medical flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform dark:bg-dark-surfaceAlt dark:text-brand-medical ring-1 ring-black/10 dark:ring-white/10"
      >
        <Crosshair className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div className="absolute bottom-3 left-3 z-[400] glass rounded-2xl px-3 py-2 text-[11px] flex items-center gap-2">
        {loading ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
            Buscando en {RADIUS_METERS / 1000} km...
          </>
        ) : pois.length === 0 ? (
          <>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#94A3B8" }}
            />
            Sin {activeSvc.title.toLowerCase()} en {RADIUS_METERS / 1000} km ·
            prueba otro servicio
          </>
        ) : (
          <>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: activeSvc.color }}
            />
            {pois.length} {activeSvc.title.toLowerCase()} cercanos
          </>
        )}
      </div>

      {permission === "denied" && (
        <div className="absolute bottom-3 right-16 z-[400] glass rounded-2xl px-3 py-2 text-[11px] max-w-[220px]">
          Sin ubicación: mostrando ejemplo en CDMX.
        </div>
      )}
    </div>
  );
}
