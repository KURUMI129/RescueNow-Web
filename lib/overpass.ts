export type POI = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  serviceId: string;
};

export type ServiceDef = {
  id: string;
  title: string;
  icon: string;
  color: string;
  overpass: string;
};

export const SERVICES: ServiceDef[] = [
  {
    id: "hospital",
    title: "Hospitales",
    icon: "🏥",
    color: "#DC2626",
    overpass:
      'node["amenity"~"hospital|clinic"](around:RADIUS,LAT,LNG);way["amenity"~"hospital|clinic"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "gas",
    title: "Gasolina",
    icon: "⛽",
    color: "#10B981",
    overpass:
      'node["amenity"="fuel"](around:RADIUS,LAT,LNG);way["amenity"="fuel"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "mechanic_car",
    title: "Mec. Autos",
    icon: "🔧",
    color: "#3B82F6",
    overpass:
      'node["shop"="car_repair"](around:RADIUS,LAT,LNG);way["shop"="car_repair"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "mechanic_moto",
    title: "Mec. Motos",
    icon: "🏍️",
    color: "#6366F1",
    overpass:
      'node["shop"="motorcycle_repair"](around:RADIUS,LAT,LNG);node["shop"="motorcycle"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "tire",
    title: "Llantera",
    icon: "🛞",
    color: "#F97316",
    overpass:
      'node["shop"="tyres"](around:RADIUS,LAT,LNG);way["shop"="tyres"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "tow",
    title: "Grúa",
    icon: "🚚",
    color: "#FFB800",
    overpass:
      'node["amenity"="vehicle_inspection"](around:RADIUS,LAT,LNG);node["shop"="car"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "electrician",
    title: "Electricista",
    icon: "⚡",
    color: "#EAB308",
    overpass:
      'node["craft"="electrician"](around:RADIUS,LAT,LNG);node["shop"="electrical"](around:RADIUS,LAT,LNG);',
  },
  {
    id: "locksmith",
    title: "Cerrajero",
    icon: "🔑",
    color: "#8B5CF6",
    overpass:
      'node["shop"="locksmith"](around:RADIUS,LAT,LNG);node["craft"="locksmith"](around:RADIUS,LAT,LNG);',
  },
];

export async function fetchPOIs(
  lat: number,
  lng: number,
  serviceId: string,
  radius = 5000,
  signal?: AbortSignal,
): Promise<POI[]> {
  const svc = SERVICES.find((s) => s.id === serviceId);
  if (!svc) return [];
  const body = svc.overpass
    .replace(/RADIUS/g, String(radius))
    .replace(/LAT/g, String(lat))
    .replace(/LNG/g, String(lng));
  const query = `[out:json][timeout:15];(${body});out center 40;`;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const elements = Array.isArray(data?.elements) ? data.elements : [];
    return elements
      .map((el: any): POI | null => {
        const plat = el.lat ?? el.center?.lat;
        const plng = el.lon ?? el.center?.lon;
        if (typeof plat !== "number" || typeof plng !== "number") return null;
        return {
          id: `${el.type}/${el.id}`,
          name: el.tags?.name ?? svc.title,
          lat: plat,
          lng: plng,
          serviceId,
        };
      })
      .filter(Boolean) as POI[];
  } catch {
    return [];
  }
}

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
