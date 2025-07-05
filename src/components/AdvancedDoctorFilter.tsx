import React, { useState } from 'react';
import { Filter, X, MapPin, DollarSign, Star, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { Doctor } from '../types';

interface AdvancedDoctorFilterProps {
  doctors: Doctor[];
  onFilteredDoctors: (doctors: Doctor[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

interface FilterState {
  specialties: string[];
  locations: string[];
  minFees: number;
  maxFees: number;
  minRating: number;
  experience: {
    min: number;
    max: number;
  };
  availability: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdvancedDoctorFilter: React.FC<AdvancedDoctorFilterProps> = ({
  doctors,
  onFilteredDoctors,
  searchTerm,
  onSearchChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    locations: [],
    minFees: 0,
    maxFees: 500,
    minRating: 0,
    experience: { min: 0, max: 30 },
    availability: [],
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  // Extract unique values from doctors data
  const uniqueSpecialties = [...new Set(doctors.map(d => d.speciality))];
  const uniqueLocations = [...new Set(doctors.map(d => d.location))];
  const availableSlots = [...new Set(doctors.flatMap(d => d.availableSlots))];

  const applyFilters = () => {
    let filtered = doctors.filter(doctor => {
      // Text search
      const matchesSearch = searchTerm === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Specialty filter
      const matchesSpecialty = filters.specialties.length === 0 || 
        filters.specialties.includes(doctor.speciality);

      // Location filter
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.includes(doctor.location);

      // Fees filter
      const matchesFees = doctor.fees >= filters.minFees && doctor.fees <= filters.maxFees;

      // Rating filter
      const matchesRating = doctor.rating >= filters.minRating;

      // Experience filter
      const matchesExperience = doctor.experience >= filters.experience.min && 
        doctor.experience <= filters.experience.max;

      // Availability filter
      const matchesAvailability = filters.availability.length === 0 || 
        filters.availability.some(slot => doctor.availableSlots.includes(slot));

      return matchesSearch && matchesSpecialty && matchesLocation && 
             matchesFees && matchesRating && matchesExperience && matchesAvailability;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'fees':
          comparison = a.fees - b.fees;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    onFilteredDoctors(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, doctors]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'specialties' | 'locations' | 'availability', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      specialties: [],
      locations: [],
      minFees: 0,
      maxFees: 500,
      minRating: 0,
      experience: { min: 0, max: 30 },
      availability: [],
      sortBy: 'rating',
      sortOrder: 'desc',
    });
    onSearchChange('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.specialties.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.minFees > 0 || filters.maxFees < 500) count++;
    if (filters.minRating > 0) count++;
    if (filters.experience.min > 0 || filters.experience.max < 30) count++;
    if (filters.availability.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-theme-text-secondary" />
        <input
          type="text"
          placeholder="Search doctors by name, specialty, or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 p-1 hover:bg-theme-hover rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-theme-text-secondary" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
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
              onClick={clearAllFilters}
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
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-3 py-1 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary text-sm"
            >
              <option value="rating">Rating</option>
              <option value="fees">Fees</option>
              <option value="experience">Experience</option>
              <option value="name">Name</option>
              <option value="location">Location</option>
            </select>
            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 border border-theme-border rounded hover:bg-theme-hover transition-colors"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-theme-card border border-theme-border rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Specialty Filter */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">Specialties</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueSpecialties.map(specialty => (
                  <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.specialties.includes(specialty)}
                      onChange={() => toggleArrayFilter('specialties', specialty)}
                      className="rounded border-theme-border text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-theme-text-primary">{specialty}</span>
                    <span className="text-xs text-theme-text-secondary">
                      ({doctors.filter(d => d.speciality === specialty).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">Locations</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueLocations.map(location => (
                  <label key={location} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={() => toggleArrayFilter('locations', location)}
                      className="rounded border-theme-border text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-theme-text-primary">{location}</span>
                    <span className="text-xs text-theme-text-secondary">
                      ({doctors.filter(d => d.location === location).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">Available Times</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableSlots.sort().map(slot => (
                  <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(slot)}
                      onChange={() => toggleArrayFilter('availability', slot)}
                      className="rounded border-theme-border text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-theme-text-primary">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fees Range */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">
                Consultation Fees: ${filters.minFees} - ${filters.maxFees}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-theme-text-secondary">Minimum: ${filters.minFees}</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={filters.minFees}
                    onChange={(e) => updateFilter('minFees', Number(e.target.value))}
                    className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="text-xs text-theme-text-secondary">Maximum: ${filters.maxFees}</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={filters.maxFees}
                    onChange={(e) => updateFilter('maxFees', Number(e.target.value))}
                    className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">
                Minimum Rating: {filters.minRating.toFixed(1)}
              </h4>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-theme-text-secondary mt-1">
                <span>0.0</span>
                <span>5.0</span>
              </div>
            </div>

            {/* Experience Range */}
            <div>
              <h4 className="font-medium text-theme-text-primary mb-3">
                Experience: {filters.experience.min} - {filters.experience.max} years
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-theme-text-secondary">Minimum: {filters.experience.min} years</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={filters.experience.min}
                    onChange={(e) => updateFilter('experience', { ...filters.experience, min: Number(e.target.value) })}
                    className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="text-xs text-theme-text-secondary">Maximum: {filters.experience.max} years</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={filters.experience.max}
                    onChange={(e) => updateFilter('experience', { ...filters.experience, max: Number(e.target.value) })}
                    className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-theme-border">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-theme-text-secondary">Active filters:</span>
                
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.specialties.map(specialty => (
                  <span key={specialty} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {specialty}
                    <button
                      onClick={() => toggleArrayFilter('specialties', specialty)}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {filters.locations.map(location => (
                  <span key={location} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    {location}
                    <button
                      onClick={() => toggleArrayFilter('locations', location)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {(filters.minFees > 0 || filters.maxFees < 500) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    ${filters.minFees} - ${filters.maxFees}
                    <button
                      onClick={() => {
                        updateFilter('minFees', 0);
                        updateFilter('maxFees', 500);
                      }}
                      className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.minRating > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                    Rating ≥ {filters.minRating.toFixed(1)}
                    <button
                      onClick={() => updateFilter('minRating', 0)}
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
  );
};

export default AdvancedDoctorFilter;