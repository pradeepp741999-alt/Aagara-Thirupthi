// Haversine distance calculator & coordinate mapping for Tamil Nadu districts & Salem localities

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const AREA_COORDINATES: Record<string, GeoPoint> = {
  // Salem Areas
  fairlands: { lat: 11.6854, lng: 78.1458 },
  hasthampatti: { lat: 11.6789, lng: 78.1633 },
  suramangalam: { lat: 11.673, lng: 78.118 },
  junction: { lat: 11.6667, lng: 78.125 },
  ammapet: { lat: 11.652, lng: 78.182 },
  shevapet: { lat: 11.654, lng: 78.145 },
  alagapuram: { lat: 11.679, lng: 78.142 },
  kondalampatti: { lat: 11.621, lng: 78.134 },
  'five roads': { lat: 11.6705, lng: 78.138 },
  'yercaud foothills': { lat: 11.72, lng: 78.19 },

  // Districts
  salem: { lat: 11.6643, lng: 78.146 },
  namakkal: { lat: 11.2189, lng: 78.1674 },
  erode: { lat: 11.341, lng: 77.7172 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  dharmapuri: { lat: 12.1211, lng: 78.1582 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  karur: { lat: 10.9601, lng: 78.0766 },
  krishnagiri: { lat: 12.5186, lng: 78.2137 },
};

/**
 * Calculates straight-line distance in kilometres using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Finds the geographic coordinates for an area name or district
 */
export function getCoordinatesForArea(name?: string, district?: string): GeoPoint {
  if (name) {
    const key = name.toLowerCase().trim();
    if (AREA_COORDINATES[key]) {
      return AREA_COORDINATES[key];
    }
  }
  if (district) {
    const dKey = district.toLowerCase().trim();
    if (AREA_COORDINATES[dKey]) {
      return AREA_COORDINATES[dKey];
    }
  }
  // Default to Salem central coords
  return AREA_COORDINATES.salem;
}
