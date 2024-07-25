// src/MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ data }) => {
  const position = [20, 0]; // Center of the map

  return (
    <MapContainer center={position} zoom={1} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {data.map((entry, index) => (
        <Circle
          key={index}
          center={getLatLong(entry.shortName)}
          fillColor={getCountryColor(entry.shortName)}
          radius={entry.emissions * 1000}
          fillOpacity={0.5}
          stroke={false}
        >
          <Popup>
            {entry.countryName}: {entry.emissions} mt
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
};

const getLatLong = (country) => {
  const coordinates = {
    BRA: [-15.7801, -47.9292],
    IND: [28.6139, 77.2090],
    CHN: [59.9042, 126.4074],
    IDN: [-6.2088, 106.8456],
    EUU: [50.8503, 4.3517],
    USA: [38.8951, -77.0364],
    IRN: [35.6892, 51.3890],
    JPN: [35.6762, 139.6503],
    KOR: [37.5665, 126.9780],
    RUS: [55.7558, 37.6173]
  };
  return coordinates[country] || [0, 0];
};

const getCountryColor = (country) => {
  const colors = {
    BRA: 'green',
    IND: 'blue',
    CHN: 'red',
    IDN: 'orange',
    EUU: 'purple',
    USA: 'yellow',
    IRN: 'brown',
    JPN: 'pink',
    KOR: 'cyan',
    RUS: 'magenta'
  };
  return colors[country] || 'gray';
};

export default MapComponent;
