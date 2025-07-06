import React from 'react';
import { MapPin, DollarSign, Star, Calendar, Shield, ExternalLink, Navigation } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
  const getDirections = () => {
    if (doctor.address?.googleMapsUrl) {
      window.open(doctor.address.googleMapsUrl, '_blank');
    } else if (doctor.address?.coordinates) {
      const { lat, lng } = doctor.address.coordinates;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      // Fallback to searching by location name
      const searchQuery = encodeURIComponent(doctor.location);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const getFullAddress = () => {
    if (doctor.address) {
      return `${doctor.address.street}, ${doctor.address.city}, ${doctor.address.state} ${doctor.address.zipCode}`;
    }
    return doctor.location;
  };

  return (
    <div className="group bg-theme-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-6 border border-theme-border hover:border-blue-300 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/20 transition-all duration-300 rounded-xl"></div>
      
      {/* Animated border glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-blue-400/20 transition-all duration-500 -z-10 blur-sm"></div>
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          <div className="relative group/avatar">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-blue-200"
            />
            {doctor.verified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
            {/* Pulse animation on hover */}
            <div className="absolute inset-0 rounded-full bg-blue-400/20 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-theme-text-primary group-hover:text-blue-600 transition-colors duration-300">{doctor.name}</h3>
            <p className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">{doctor.speciality}</p>
            <p className="text-sm text-theme-text-secondary mt-1 group-hover:text-theme-text-primary transition-colors duration-300">{doctor.experience} years experience</p>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                <Star className="w-4 h-4 text-yellow-500 fill-current group-hover:text-yellow-400 transition-colors duration-300" />
                <span className="ml-1 text-sm font-medium text-theme-text-primary">{doctor.rating}</span>
                <span className="text-sm text-theme-text-secondary">({doctor.totalReviews})</span>
              </div>
              
              <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-4 h-4 text-theme-text-secondary group-hover:text-blue-500 transition-colors duration-300" />
                <span className="ml-1 text-sm text-theme-text-secondary group-hover:text-theme-text-primary transition-colors duration-300">{doctor.location}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-2 group-hover:scale-105 transition-transform duration-300">
              <DollarSign className="w-4 h-4 text-green-600 group-hover:text-green-500 transition-colors duration-300" />
              <span className="ml-1 text-sm font-medium text-theme-text-primary">${doctor.fees}</span>
              <span className="text-sm text-theme-text-secondary ml-1">consultation fee</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-theme-border group-hover:border-blue-200 transition-colors duration-300">
          <p className="text-sm text-theme-text-secondary mb-3 group-hover:text-theme-text-primary transition-colors duration-300">{doctor.about}</p>
          
          {/* Address Section */}
          {doctor.address && (
            <div className="mb-3 p-3 bg-theme-background rounded-lg border border-theme-border group-hover:bg-blue-50/50 group-hover:border-blue-200 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-theme-text-primary mb-1">Clinic Address:</p>
                  <p className="text-sm text-theme-text-secondary group-hover:text-theme-text-primary transition-colors duration-300">{getFullAddress()}</p>
                </div>
                <button
                  onClick={getDirections}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs transform hover:scale-105 hover:shadow-md"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </button>
              </div>
              
              {doctor.address.googleMapsUrl && (
                <div className="mt-2">
                  <a
                    href={doctor.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs transition-all duration-300 hover:scale-105"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View on Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300">
              <Calendar className="w-4 h-4 text-theme-text-secondary group-hover:text-green-500 transition-colors duration-300" />
              <span className="text-sm text-theme-text-secondary group-hover:text-theme-text-primary transition-colors duration-300">
                {doctor.availableSlots.length} slots available
              </span>
            </div>
            
            <button
              onClick={() => onBookAppointment(doctor)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group/button"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;