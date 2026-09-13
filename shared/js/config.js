// VenueLuxe Platform Global Configuration
// Centralized configuration for platform defaults, regions, application settings, and 100% Free Maps

(function() {
  window.VENUELUXE_CONFIG = {
    // Application Settings
    APP_NAME: 'VenueLuxe',
    PRIMARY_REGION: 'Karnataka, India',
    DEFAULT_CITIES: ['Karkala', 'Mangalore', 'Udupi', 'Manipal', 'Bangalore'],

    // Maps & Geocoding Configuration (100% Free OpenStreetMap Ecosystem - Zero Keys Required)
    MAPS: {
      PROVIDER: 'osm',
      DEFAULT_CENTER: [13.2172, 74.9966], // Default center: Karkala / Udupi, Karnataka
      DEFAULT_ZOOM: 14,
      
      // Clean high-performance Carto Voyager tiles based on OpenStreetMap
      CARTO_VOYAGER_URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      // Standard OpenStreetMap fallback
      OSM_STANDARD_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      
      // Free Geocoding endpoints (No API key needed)
      NOMINATIM_URL: 'https://nominatim.openstreetmap.org/search',
      PHOTON_OSM_URL: 'https://photon.komoot.io/api/'
    },

    // Tile layer provider for Leaflet maps
    getTileLayerConfig() {
      return {
        url: this.MAPS.CARTO_VOYAGER_URL,
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
          maxZoom: 19,
          subdomains: 'abcd'
        }
      };
    },

    // 100% Free Address Geocoding (Nominatim OSM + Photon OSM Fallback)
    async geocodeAddress(query) {
      if (!query || !query.trim()) return null;
      const maps = this.MAPS;

      // 1. First attempt: Nominatim OpenStreetMap
      try {
        const url = `${maps.NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              displayName: data[0].display_name
            };
          }
        }
      } catch (e) {
        console.warn('[VenueLuxe Map] Nominatim search attempt failed, trying Photon...', e);
      }

      // 2. Second attempt: Photon OSM Geocoder (Fast & completely free)
      try {
        const photonUrl = `${maps.PHOTON_OSM_URL}?q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(photonUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates; // [lng, lat]
            const props = data.features[0].properties;
            const name = [props.name, props.street, props.city, props.state].filter(Boolean).join(', ');
            return {
              lat: parseFloat(coords[1]),
              lng: parseFloat(coords[0]),
              displayName: name || query
            };
          }
        }
      } catch (e) {
        console.error('[VenueLuxe Map] Photon search error:', e);
      }

      return null;
    }
  };
})();
