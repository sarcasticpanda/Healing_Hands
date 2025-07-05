import React from 'react';
import { MapPin, DollarSign, Star, Calendar, Shield, ExternalLink, Navigation } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
  const handleGetDirections = () => {
    // Mock Google Maps URL - in real app, this would use actual coordinates
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(doctor.location)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="bg-theme-card rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-theme-border">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          {doctor.verified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-theme-text-primary">{doctor.name}</h3>
              <p className="text-blue-600 font-medium">{doctor.speciality}</p>
              <p className="text-sm text-theme-text-secondary mt-1">{doctor.experience} years experience</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-medium text-theme-text-primary">{doctor.rating}</span>
                <span className="text-sm text-theme-text-secondary">({doctor.totalReviews})</span>
              </div>
              <div className="flex items-center mt-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="ml-1 text-sm font-medium text-theme-text-primary">${doctor.fees}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-theme-text-secondary" />
              <span className="ml-1 text-sm text-theme-text-secondary">{doctor.location}</span>
            </div>
            
            <button
              onClick={handleGetDirections}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-theme-border">
        <p className="text-sm text-theme-text-secondary mb-3">{doctor.about}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-theme-text-secondary" />
            <span className="text-sm text-theme-text-secondary">
              {doctor.availableSlots.length} slots available
            </span>
          </div>
          
          <button
            onClick={() => onBookAppointment(doctor)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;