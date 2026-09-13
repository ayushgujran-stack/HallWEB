// VenueLuxe Platform Global Configuration
// Centralized configuration for platform defaults, regions, application settings, and map providers

(function() {
  const env = (typeof window !== 'undefined' && window.__ENV) ? window.__ENV : {};

  window.VENUELUXE_CONFIG = {
    // Application Settings
    APP_NAME: env.VITE_APP_TITLE || 'VenueLuxe',
    PRIMARY_REGION: 'Karnataka, India',
    DEFAULT_CITIES: ['Karkala', 'Mangalore', 'Udupi', 'Manipal', 'Bangalore'],

    // Maps & Geocoding Configuration (Supports OpenStreetMap, Mapbox, and LocationIQ)
    MAPS: {
      PROVIDER: env.VITE_MAP_PROVIDER || 'osm',
      DEFAULT_CENTER: [13.2172, 74.9966], // Default: Karkala / Udupi, Karnataka
      DEFAULT_ZOOM: 14,
      
      // 1. OpenStreetMap & Nominatim (100% Free - Default)
      OSM_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      CARTO_VOYAGER_URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      NOMINATIM_URL: env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search',

      // 2. Mapbox (Vector tiles & high performance)
      MAPBOX_ACCESS_TOKEN: env.VITE_MAPBOX_ACCESS_TOKEN || '',

      // 3. LocationIQ (Fast geocoding & address autocomplete)
      LOCATIONIQ_API_KEY: env.VITE_LOCATIONIQ_API_KEY || '',
      LOCATIONIQ_SEARCH_URL: 'https://us1.locationiq.com/v1/search',
      LOCATIONIQ_AUTOCOMPLETE_URL: 'https://api.locationiq.com/v1/autocomplete'
    },

    // Dynamic tile layer provider for Leaflet maps
    getTileLayerConfig() {
      const maps = this.MAPS;
      // If Mapbox token is provided and selected
      if (maps.MAPBOX_ACCESS_TOKEN && maps.PROVIDER === 'mapbox') {
        return {
          url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${maps.MAPBOX_ACCESS_TOKEN}`,
          options: {
            attribution: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 19,
            tileSize: 512,
            zoomOffset: -1
          }
        };
      }

      // Default: Clean Carto Voyager tiles based on OpenStreetMap
      return {
        url: maps.CARTO_VOYAGER_URL,
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        }
      };
    },

    // Geocode an address query using LocationIQ (if key present) or Nominatim OSM (free fallback)
    async geocodeAddress(query) {
      if (!query || !query.trim()) return null;
      const maps = this.MAPS;

      // 1. Try LocationIQ if key exists
      if (maps.LOCATIONIQ_API_KEY) {
        try {
          const url = `${maps.LOCATIONIQ_SEARCH_URL}?key=${encodeURIComponent(maps.LOCATIONIQ_API_KEY)}&q=${encodeURIComponent(query)}&format=json&limit=1`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
              };
            }
          }
        } catch (e) {
          console.warn('[VenueLuxe Map] LocationIQ query failed, falling back to Nominatim', e);
        }
      }

      // 2. OpenStreetMap Nominatim fallback (100% free)
      try {
        const url = `${maps.NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'en'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              displayName: data[0].display_name
            };
          }
        }
      } catch (e) {
        console.error('[VenueLuxe Map] Geocoding error:', e);
      }
      return null;
    }
  };
})();
