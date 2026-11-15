// Routing service using Open Source Routing Machine (OSRM)
export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
  source: string;
  isFeasible: boolean;
  fetchedAt: string;
}

export async function calculateRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteResult> {
  const fetchedAt = new Date().toISOString();
  try {
    // OSRM coordinates order: {longitude},{latitude}
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`OSRM responded with status ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route returned by OSRM');
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMinutes = Math.round(route.duration / 60);
    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]]
    );

    // Feasibility check: > 7 hours driving between single activities is flagged
    const isFeasible = durationMinutes < 420;

    return {
      distanceKm,
      durationMinutes,
      coordinates,
      source: 'OSRM Open Engine',
      isFeasible,
      fetchedAt
    };
  } catch (error: any) {
    // Approximate haversine distance fallback if OSRM is unreachable
    const R = 6371; // Earth radius in km
    const dLat = ((endLat - startLat) * Math.PI) / 180;
    const dLng = ((endLng - startLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((startLat * Math.PI) / 180) *
        Math.cos((endLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c * 10) / 10;
    const durationMinutes = Math.round((distanceKm / 40) * 60); // 40 km/h mountain speed

    return {
      distanceKm,
      durationMinutes,
      coordinates: [
        [startLat, startLng],
        [endLat, endLng]
      ],
      source: 'Geodesic Estimate (OSRM Fallback)',
      isFeasible: durationMinutes < 420,
      fetchedAt
    };
  }
}
