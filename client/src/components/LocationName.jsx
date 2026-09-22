import { useEffect, useState } from "react";

const locationCache = new Map();

export function LocationName({
  coordinates,
  fallback = "Location unavailable",
}) {
  const key = Array.isArray(coordinates) ? coordinates.join(",") : "";
  const [name, setName] = useState(() => locationCache.get(key) || "");

  useEffect(() => {
    if (!key || key.split(",").length !== 2 || locationCache.has(key)) return;

    let cancelled = false;
    const [longitude, latitude] = key.split(",");
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error("Reverse geocoding failed");
        return response.json();
      })
      .then((result) => {
        const placeName = result.display_name || fallback;
        locationCache.set(key, placeName);
        if (!cancelled) setName(placeName);
      })
      .catch(() => {
        if (!cancelled) setName(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, [key, fallback]);

  return <>{name || "Finding place..."}</>;
}
