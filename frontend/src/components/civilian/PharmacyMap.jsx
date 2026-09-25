import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when location changes
function RecenterAutomatically({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

const PharmacyMap = ({ userLocation, pharmacies, onSelectPharmacy }) => {
    // Default to Colombo if location not yet loaded (approx 6.9271, 79.8612)
    const center = userLocation ? [userLocation.lat, userLocation.lng] : [6.9271, 79.8612];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {userLocation && (
                <Fragment>
                    <RecenterAutomatically lat={userLocation.lat} lng={userLocation.lng} />
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                       <Popup>You are here</Popup>
                    </Marker>
               </Fragment>
            )}

            {pharmacies.map((pharmacy) => (
                pharmacy.latitude && pharmacy.longitude ? (
                    <Marker 
                        key={pharmacy.id} 
                        position={[pharmacy.latitude, pharmacy.longitude]}
                        eventHandlers={{
                            click: () => onSelectPharmacy(pharmacy),
                        }}
                    >
                        <Popup>
                            <div className="text-sm font-semibold">{pharmacy.name}</div>
                            <div className="text-xs">{pharmacy.address}</div>
                            <div className="text-xs text-blue-600 font-bold mt-1">
                                {pharmacy.available} medicines available
                            </div>
                        </Popup>
                    </Marker>
                ) : null
            ))}
        </MapContainer>
    );
};

// Need this import for Fragment inside return
import { Fragment } from 'react';

export default PharmacyMap;
