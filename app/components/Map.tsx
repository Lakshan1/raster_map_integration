'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const position: [number, number] = [0, 20]; // Center of Africa

  // Africa bounds
  const africaBounds: L.LatLngBoundsExpression = [
    [-35, -20],  // Southwest
    [37, 52]     // Northeast
  ];

  // Generate year range (1981-2024)
  const years = Array.from({ length: 44 }, (_, i) => 1981 + i);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Year Selector UI */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Year:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{
            padding: '5px 10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Viewing data for {selectedYear}
        </div>
      </div>

      <MapContainer
        center={position}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        minZoom={3}
        maxZoom={12}
        maxBounds={africaBounds}
        maxBoundsViscosity={1.0}
      >
        {/* Base layer - Satellite imagery */}
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={12}
        />

        {/* Overlay layer - Multi-Year GeoTIFF tiles */}
        <TileLayer
          key={selectedYear} // Force re-render when year changes
          url={`http://localhost:3001/tiles/${selectedYear}/{z}/{x}/{y}.png`}
          attribution={`IWMI Raster Data (${selectedYear})`}
          opacity={1.0}
          maxZoom={12}
          minZoom={0}
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          eventHandlers={{
            tileerror: (error) => {
              console.warn(`Tile load error for year ${selectedYear}:`, error);
            }
          }}
        />

        <Marker position={position}>
          <Popup>
            Africa - Raster Data Visualization ({selectedYear})
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
