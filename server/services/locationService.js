const indianLocations = require('../data/indianLocations.json');

// In-memory cache for reverse geocoding lookups
const geocodeCache = new Map();

/**
 * Get all available Indian states and their districts
 */
function getStatesAndDistricts() {
  return indianLocations.states.map(state => ({
    name: state.name,
    code: state.code,
    capital: state.capital,
    districts: state.districts.map(d => ({
      name: d.name,
      lat: d.lat,
      lng: d.lng
    }))
  }));
}

/**
 * Find closest district in dataset by euclidean / haversine distance
 */
function findClosestDistrict(lat, lng) {
  let closest = null;
  let minDistance = Infinity;

  for (const state of indianLocations.states) {
    for (const district of state.districts) {
      const dLat = district.lat - lat;
      const dLng = district.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = {
          state: state.name,
          district: district.name,
          village: '',
          lat: district.lat,
          lng: district.lng
        };
      }
    }
  }

  return closest || {
    state: 'Tamil Nadu',
    district: 'Salem',
    village: '',
    lat,
    lng
  };
}

/**
 * Reverse geocode coordinates to Village, District, State, Country
 * Uses OpenStreetMap Nominatim with fast fallback to offline centroid matcher
 */
async function reverseGeocode(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid latitude or longitude provided');
  }

  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AgriShield-AI-SIH-FarmerPlatform/1.0 (contact@agrishield.ai)'
      }
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const village = addr.village || addr.suburb || addr.hamlet || addr.town || addr.city || addr.county || '';
      const district = addr.state_district || addr.district || addr.county || addr.city || '';
      const state = addr.state || '';
      const country = addr.country || 'India';

      const result = {
        state: state || 'Tamil Nadu',
        district: district || 'Salem',
        village: village || '',
        formatted: [village, district, state, country].filter(Boolean).join(', '),
        lat: latitude,
        lng: longitude
      };

      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    // Network timeout or offline, use local coordinate matcher
  }

  // Fallback to closest local centroid
  const fallback = findClosestDistrict(latitude, longitude);
  const fallbackResult = {
    ...fallback,
    formatted: [fallback.district, fallback.state, 'India'].filter(Boolean).join(', '),
    lat: latitude,
    lng: longitude
  };
  geocodeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

module.exports = {
  getStatesAndDistricts,
  reverseGeocode,
  findClosestDistrict
};
