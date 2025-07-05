import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Save, Edit, X, Check } from 'lucide-react';

interface DoctorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
}

interface DoctorLocationManagerProps {
  currentAddress?: DoctorAddress;
  onSave: (address: DoctorAddress) => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

const DoctorLocationManager: React.FC<DoctorLocationManagerProps> = ({
  currentAddress,
  onSave,
  isEditing = false,
  onToggleEdit,
}) => {
  const [address, setAddress] = useState<DoctorAddress>(
    currentAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      coordinates: undefined,
      googleMapsUrl: '',
    }
  );
  const [isLocating, setIsLocating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof DoctorAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Generate Google Maps URL
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          setAddress(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude },
            googleMapsUrl,
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          alert('Unable to get your location. Please enter coordinates manually or provide a Google Maps URL.');
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const generateGoogleMapsUrl = () => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    setAddress(prev => ({ ...prev, googleMapsUrl }));
  };

  const handleSave = () => {
    if (!address.street || !address.city || !address.state) {
      alert('Please fill in all required address fields.');
      return;
    }

    // If no Google Maps URL is provided, generate one from the address
    if (!address.googleMapsUrl) {
      generateGoogleMapsUrl();
    }

    onSave(address);
    if (onToggleEdit) onToggleEdit();
  };

  const getFullAddress = () => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  if (!isEditing && currentAddress) {
    return (
      <div className="bg-theme-card rounded-lg border border-theme-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-theme-text-primary flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Clinic Location
          </h4>
          {onToggleEdit && (
            <button
              onClick={onToggleEdit}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-theme-text-primary">{getFullAddress()}</p>
          
          {currentAddress.coordinates && (
            <p className="text-sm text-theme-text-secondary">
              Coordinates: {currentAddress.coordinates.lat.toFixed(6)}, {currentAddress.coordinates.lng.toFixed(6)}
            </p>
          )}
          
          {currentAddress.googleMapsUrl && (
            <a
              href={currentAddress.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Google Maps</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-theme-text-primary flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Clinic Location
        </h4>
        {onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className="flex items-center space-x-1 text-theme-text-secondary hover:text-theme-text-primary text-sm"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            placeholder="123 Main Street"
            className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            City *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="New York"
            className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            State *
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="NY"
            className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            value={address.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="10001"
            className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            Country
          </label>
          <select
            value={address.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Location Coordinates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-theme-text-primary">Precise Location (Optional)</h5>
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Navigation className="h-4 w-4" />
            <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
          </button>
        </div>

        {address.coordinates && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Location coordinates set</span>
            </div>
            <p className="text-sm text-green-700">
              Latitude: {address.coordinates.lat.toFixed(6)}, Longitude: {address.coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      {/* Google Maps URL Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            Google Maps URL (Optional)
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={address.googleMapsUrl}
              onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="flex-1 px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
            />
            <button
              onClick={generateGoogleMapsUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-theme-text-secondary mt-1">
            Patients will use this link to get directions to your clinic
          </p>
        </div>

        {address.googleMapsUrl && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {showPreview ? 'Hide Preview' : 'Preview Link'}
            </button>
            <a
              href={address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Test Link</span>
            </a>
          </div>
        )}

        {showPreview && address.googleMapsUrl && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 break-all">{address.googleMapsUrl}</p>
          </div>
        )}
      </div>

      {/* Address Preview */}
      <div className="bg-theme-background p-4 rounded-lg border border-theme-border">
        <h5 className="font-medium text-theme-text-primary mb-2">Address Preview</h5>
        <p className="text-theme-text-secondary">{getFullAddress()}</p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="h-4 w-4" />
          <span>Save Location</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorLocationManager;