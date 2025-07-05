import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Doctor } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSearchProps {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
}

interface LocationCoords {
  lat: number;
  lng: number;
}

// Mock coordinates for demo purposes
const locationCoords: Record<string, LocationCoords> = {
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589 },
};

const MapSearch: React.FC<MapSearchProps> = ({ 
  doctors, 
  onDoctorSelect, 
  searchRadius, 
  onRadiusChange 
}) => {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [mapCenter, setMapCenter] = useState<LocationCoords>({ lat: 40.7128, lng: -74.0060 });
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          // Fallback to New York
          setMapCenter({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const doctorsWithCoords = doctors.map(doctor => ({
    ...doctor,
    coords: locationCoords[doctor.location] || { lat: 40.7128, lng: -74.0060 },
  }));

  const filteredDoctors = userLocation 
    ? doctorsWithCoords.filter(doctor => {
        const distance = calculateDistance(userLocation, doctor.coords);
        return distance <= searchRadius;
      })
    : doctorsWithCoords;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Navigation className="h-4 w-4" />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
          
          {userLocation && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm text-theme-text-secondary">Location found</span>
            </div>
          )}
        </div>

        {userLocation && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-theme-text-primary">
              Search Radius: {searchRadius} miles
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="w-32 h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}
      </div>

      <div className="h-96 rounded-lg overflow-hidden border border-theme-border">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {filteredDoctors.map(doctor => (
            <Marker
              key={doctor.id}
              position={[doctor.coords.lat, doctor.coords.lng]}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-blue-600">{doctor.speciality}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doctor.location}</p>
                  <p className="text-sm font-medium text-green-600 mb-3">${doctor.fees}</p>
                  <button
                    onClick={() => onDoctorSelect(doctor)}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {userLocation && (
        <div className="text-sm text-theme-text-secondary">
          Showing {filteredDoctors.length} doctors within {searchRadius} miles of your location
        </div>
      )}
    </div>
  );
};

// Helper function to calculate distance between two coordinates
function calculateDistance(pos1: LocationCoords, pos2: LocationCoords): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default MapSearch;