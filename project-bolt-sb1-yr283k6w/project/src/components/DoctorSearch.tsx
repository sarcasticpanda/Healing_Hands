import React, { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Star, X, SlidersHorizontal } from 'lucide-react';
import { Doctor } from '../types';
import { mockDoctors, specialties, locations } from '../data/mockData';
import DoctorCard from './DoctorCard';

interface DoctorSearchProps {
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorSearch: React.FC<DoctorSearchProps> = ({ onBookAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [maxFees, setMaxFees] = useState(500);
  const [minFees, setMinFees] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || 
                           doctor.speciality === selectedSpecialty;
    const matchesLocation = selectedLocation === 'All Locations' || 
                          doctor.location === selectedLocation;
    const matchesFees = doctor.fees >= minFees && doctor.fees <= maxFees;
    const matchesRating = doctor.rating >= minRating;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesFees && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'fees-low':
        return a.fees - b.fees;
      case 'fees-high':
        return b.fees - a.fees;
      case 'experience':
        return b.experience - a.experience;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
    setSelectedLocation('All Locations');
    setMaxFees(500);
    setMinFees(0);
    setMinRating(0);
    setSortBy('rating');
  };

  const activeFiltersCount = [
    searchTerm,
    selectedSpecialty !== 'All Specialties' ? selectedSpecialty : null,
    selectedLocation !== 'All Locations' ? selectedLocation : null,
    maxFees !== 500 ? 'max-fees' : null,
    minFees !== 0 ? 'min-fees' : null,
    minRating !== 0 ? 'rating' : null,
  ].filter(Boolean).length;

  return (
    <section className="py-12 bg-theme-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-theme-text-primary mb-4">Find Your Perfect Doctor</h2>
          <p className="text-theme-text-secondary max-w-2xl mx-auto">
            Search and filter through our network of verified healthcare professionals
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-theme-card rounded-xl shadow-lg p-6 mb-8 border border-theme-border">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-theme-text-secondary" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 p-1 hover:bg-theme-hover rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-theme-text-secondary" />
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-theme-border rounded-lg hover:bg-theme-hover transition-colors text-theme-text-primary relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Advanced Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-theme-text-secondary">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary text-sm"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="fees-low">Lowest Fees</option>
                    <option value="fees-high">Highest Fees</option>
                    <option value="experience">Most Experienced</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
                
                <div className="text-sm text-theme-text-secondary">
                  <span className="font-medium text-blue-600">{filteredDoctors.length}</span> doctors found
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-theme-border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Specialty Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-theme-text-primary">
                      <Filter className="inline w-4 h-4 mr-2" />
                      Specialty
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    >
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-theme-text-primary">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      City/Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-theme-text-primary">
                      <Star className="inline w-4 h-4 mr-2" />
                      Minimum Rating: {minRating.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-theme-text-secondary">
                      <span>0.0</span>
                      <span>5.0</span>
                    </div>
                  </div>

                  {/* Fees Range Filter */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-theme-text-primary">
                      <DollarSign className="inline w-4 h-4 mr-2" />
                      Consultation Fees: ${minFees} - ${maxFees}
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-theme-text-secondary">Minimum: ${minFees}</label>
                        <input
                          type="range"
                          min="0"
                          max="500"
                          step="10"
                          value={minFees}
                          onChange={(e) => setMinFees(Number(e.target.value))}
                          className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-theme-text-secondary">Maximum: ${maxFees}</label>
                        <input
                          type="range"
                          min="0"
                          max="500"
                          step="10"
                          value={maxFees}
                          onChange={(e) => setMaxFees(Number(e.target.value))}
                          className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-theme-text-secondary">
                      <span>$0</span>
                      <span>$500</span>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-theme-border">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-theme-text-secondary">Active filters:</span>
                      {searchTerm && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Search: "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm('')}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedSpecialty !== 'All Specialties' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {selectedSpecialty}
                          <button
                            onClick={() => setSelectedSpecialty('All Specialties')}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {selectedLocation !== 'All Locations' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {selectedLocation}
                          <button
                            onClick={() => setSelectedLocation('All Locations')}
                            className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {(minFees > 0 || maxFees < 500) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          ${minFees} - ${maxFees}
                          <button
                            onClick={() => {
                              setMinFees(0);
                              setMaxFees(500);
                            }}
                            className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {minRating > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          Rating ≥ {minRating.toFixed(1)}
                          <button
                            onClick={() => setMinRating(0)}
                            className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookAppointment={onBookAppointment}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
            <p className="text-theme-text-secondary text-lg">No doctors found matching your criteria</p>
            <p className="text-theme-text-secondary mt-2 mb-4">Try adjusting your search or filters to find more results.</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorSearch;