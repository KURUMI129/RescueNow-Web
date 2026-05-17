import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "RescueNow · App mexicana de emergencias y asistencia vial con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0B1120 0%, #1E1B4B 50%, #4C1D95 100%)",
          padding: 70,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top: logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 50,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#E11D48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              boxShadow: "0 12px 32px rgba(225,29,72,0.4)",
            }}
          >
            🚑
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              RescueNow
            </span>
            <span
              style={{
                color: "#FACC15",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              Hecho en México
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            zIndex: 1,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            El copiloto que nunca
          </span>
          <span
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #E11D48, #F59E0B, #0EA5E9)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            te falla en la carretera
          </span>
          <span
            style={{
              color: "#94A3B8",
              fontSize: 26,
              marginTop: 20,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Detección automática de choques · Ficha médica S.O.S. · Mapa de
            servicios · IA rescatista
          </span>
        </div>

        {/* Bottom: features pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            zIndex: 1,
            marginTop: 30,
            flexWrap: "wrap",
          }}
        >
          {[
            { emoji: "🚨", text: "SOS automático" },
            { emoji: "🏥", text: "Ficha médica" },
            { emoji: "🗺️", text: "8 servicios" },
            { emoji: "🐕", text: "Asistente IA Rex" },
          ].map((p) => (
            <div
              key={p.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.15)",
                borderRadius: 999,
                padding: "12px 22px",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <span>{p.emoji}</span>
              <span>{p.text}</span>
            </div>
          ))}
        </div>

        {/* URL footer */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 70,
            color: "#64748B",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          rescuenow.me
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
