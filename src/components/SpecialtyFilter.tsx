import React from 'react';
import { Stethoscope, Heart, Brain, Baby, Bone, Eye, Ear } from 'lucide-react';

interface SpecialtyFilterProps {
  selectedSpecialties: string[];
  onSpecialtyToggle: (specialty: string) => void;
  doctorCounts: Record<string, number>;
}

const specialtyIcons: Record<string, React.ComponentType<any>> = {
  'Cardiology': Heart,
  'Dermatology': Eye,
  'Pediatrics': Baby,
  'Orthopedics': Bone,
  'Neurology': Brain,
  'Psychiatry': Brain,
  'General Medicine': Stethoscope,
  'Gynecology': Stethoscope,
  'Oncology': Stethoscope,
  'ENT': Ear,
};

const specialtyColors: Record<string, string> = {
  'Cardiology': 'bg-red-100 text-red-700 border-red-200',
  'Dermatology': 'bg-pink-100 text-pink-700 border-pink-200',
  'Pediatrics': 'bg-blue-100 text-blue-700 border-blue-200',
  'Orthopedics': 'bg-gray-100 text-gray-700 border-gray-200',
  'Neurology': 'bg-purple-100 text-purple-700 border-purple-200',
  'Psychiatry': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'General Medicine': 'bg-green-100 text-green-700 border-green-200',
  'Gynecology': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Oncology': 'bg-orange-100 text-orange-700 border-orange-200',
  'ENT': 'bg-teal-100 text-teal-700 border-teal-200',
};

const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({
  selectedSpecialties,
  onSpecialtyToggle,
  doctorCounts,
}) => {
  const specialties = Object.keys(specialtyIcons);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-theme-text-primary">Filter by Specialty</h3>
        {selectedSpecialties.length > 0 && (
          <button
            onClick={() => selectedSpecialties.forEach(specialty => onSpecialtyToggle(specialty))}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all ({selectedSpecialties.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {specialties.map(specialty => {
          const IconComponent = specialtyIcons[specialty];
          const isSelected = selectedSpecialties.includes(specialty);
          const count = doctorCounts[specialty] || 0;
          const colorClass = specialtyColors[specialty] || 'bg-gray-100 text-gray-700 border-gray-200';

          return (
            <button
              key={specialty}
              onClick={() => onSpecialtyToggle(specialty)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : `border-theme-border hover:border-blue-300 ${colorClass}`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-white'}`}>
                  <IconComponent className={`h-5 w-5 ${isSelected ? 'text-blue-600' : ''}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-theme-text-primary'}`}>
                    {specialty}
                  </h4>
                  <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-theme-text-secondary'}`}>
                    {count} doctor{count !== 1 ? 's' : ''} available
                  </p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedSpecialties.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSpecialties.map(specialty => (
              <span
                key={specialty}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {specialty}
                <button
                  onClick={() => onSpecialtyToggle(specialty)}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtyFilter;