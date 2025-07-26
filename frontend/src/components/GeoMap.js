
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export default function GeoMap({ transactions }) {
  // Group transactions by city/country with lat/lng if available
  const areaMap = {};
  transactions.forEach(tx => {
    const loc = tx.merchant_details?.geometry?.location;
    // Extract city/country for marker popup
    let city = '', country = '';
    const comps = tx.merchant_details?.address_components;
    if (Array.isArray(comps)) {
      for (const comp of comps) {
        if (comp.types?.includes('locality')) city = comp.long_name;
        if (comp.types?.includes('country')) country = comp.long_name;
      }
    }
    let area = '';
    if (city && country) area = `${city}, ${country}`;
    else if (tx.merchant_details?.vicinity) area = tx.merchant_details.vicinity;
    else area = tx.merchant_details?.name || tx.description;
    if (loc && loc.lat && loc.lng) {
      const key = `${loc.lat},${loc.lng}`;
      if (!areaMap[key]) {
        areaMap[key] = { lat: loc.lat, lng: loc.lng, area, amount: 0 };
      }
      areaMap[key].amount += tx.amount || 0;
    }
  });
  const points = Object.values(areaMap);

  return (
    <Paper elevation={4} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', borderRadius: 4, minHeight: 400 }}>
      <Typography variant="h6" fontWeight={700} color="#43D8C9" sx={{ mb: 2, letterSpacing: 1 }}>
        Geographic Spending Analysis
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Pin code/area-wise spending patterns visualized on map
      </Typography>
      <MapContainer center={[22.5937, 78.9629]} zoom={4.5} style={{ height: 320, width: '100%', borderRadius: 8 }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={process.env.REACT_APP_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        {points.length === 0 && (
          <></>
        )}
        {points.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]}>
            <Popup>
              <b>{loc.area}</b><br />Spent: ₹{loc.amount.toLocaleString('en-IN')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Paper>
  );
}
