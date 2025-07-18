import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Settings, LogOut, Search, Plus, MapPin, Shield, CheckCircle, AlertCircle, XCircle, Pill, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAppointments, mockDoctors, mockMedications } from '../data/mockData';
import { Doctor, Medication } from '../types';
import DoctorCard from './DoctorCard';
import AppointmentModal from './AppointmentModal';
import DoctorLocationManager from './DoctorLocationManager';
import DoctorVerification from './DoctorVerification';
import AdvancedDoctorFilter from './AdvancedDoctorFilter';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userAppointments, setUserAppointments] = useState(
    mockAppointments.filter(
      appointment => appointment.patientId === user?.id || appointment.doctorId === user?.id
    )
  );

  // Get user medications (for patients)
  const userMedications = user?.role === 'patient' ? mockMedications : [];
  const activeMedications = userMedications.filter(med => med.status === 'active');
  const recentMedications = userMedications.slice(0, 3); // Show last 3 medications

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    
    // Add the new appointment to the list
    const newAppointment = {
      ...appointmentData,
      patientId: user?.id || '',
    };
    
    setUserAppointments(prev => [...prev, newAppointment]);
    setShowAppointmentModal(false);
    
    // Switch to appointments tab to show the new booking
    setActiveTab('appointments');
  };

  const handleLocationSave = (address: any) => {
    console.log('Location saved:', address);
    alert('Clinic location updated successfully!');
    setIsEditingLocation(false);
  };

  const handleFilteredDoctors = (doctors: Doctor[]) => {
    setFilteredDoctors(doctors);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMedicationTypeIcon = (type: string) => {
    switch (type) {
      case 'tablet':
      case 'capsule':
        return '💊';
      case 'syrup':
        return '🥤';
      case 'injection':
        return '💉';
      case 'cream':
        return '🧴';
      case 'drops':
        return '💧';
      default:
        return '💊';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Mock current doctor's address for demonstration
  const currentDoctorAddress = user?.role === 'doctor' ? {
    street: '123 Medical Center Drive',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    googleMapsUrl: 'https://www.google.com/maps/place/123+Medical+Center+Drive,+New+York,+NY+10001'
  } : undefined;

  // Mock verification status for demonstration
  const mockVerificationStatus = 'not_submitted'; // Can be: 'not_submitted', 'pending', 'approved', 'rejected'

  return (
    <div className="min-h-screen bg-theme-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-theme-text-primary">{user?.name}</h3>
                <p className="text-sm text-theme-text-secondary capitalize">{user?.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-theme-text-secondary hover:bg-theme-hover'
                }`}
              >
                <Activity className="h-5 w-5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'appointments'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-theme-text-secondary hover:bg-theme-hover'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>My Appointments</span>
                {userAppointments.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userAppointments.length}
                  </span>
                )}
              </button>

              {user?.role === 'patient' && (
                <>
                  <button
                    onClick={() => setActiveTab('medications')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'medications'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-theme-text-secondary hover:bg-theme-hover'
                    }`}
                  >
                    <Pill className="h-5 w-5" />
                    <span>My Medications</span>
                    {activeMedications.length > 0 && (
                      <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {activeMedications.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('book-appointment')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'book-appointment'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-theme-text-secondary hover:bg-theme-hover'
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Book Appointment</span>
                  </button>
                </>
              )}

              {user?.role === 'doctor' && (
                <>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'verification'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-theme-text-secondary hover:bg-theme-hover'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Verification</span>
                    {mockVerificationStatus === 'pending' && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('clinic-location')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'clinic-location'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-theme-text-secondary hover:bg-theme-hover'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Clinic Location</span>
                  </button>
                </>
              )}
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-theme-text-secondary hover:bg-theme-hover'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-theme-text-secondary hover:bg-theme-hover'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                      <p className="text-blue-100">
                        {user?.role === 'patient' 
                          ? 'Manage your health appointments and track your wellness journey.'
                          : 'Manage your patient appointments and clinic information.'
                        }
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Activity className="h-16 w-16 text-blue-200" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-theme-text-secondary text-sm font-medium">
                          {user?.role === 'patient' ? 'Total Appointments' : 'Patient Appointments'}
                        </p>
                        <p className="text-2xl font-bold text-theme-text-primary">{userAppointments.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {user?.role === 'patient' && (
                    <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-theme-text-secondary text-sm font-medium">Active Medications</p>
                          <p className="text-2xl font-bold text-theme-text-primary">{activeMedications.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-theme-text-secondary text-sm font-medium">Health Score</p>
                        <p className="text-2xl font-bold text-theme-text-primary">85%</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Medications for Patients */}
                {user?.role === 'patient' && recentMedications.length > 0 && (
                  <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-theme-text-primary flex items-center">
                        <Pill className="h-6 w-6 text-purple-600 mr-2" />
                        Recent Medications
                      </h3>
                      <button
                        onClick={() => setActiveTab('medications')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {recentMedications.map((medication) => (
                        <div
                          key={medication.id}
                          className="flex items-center justify-between p-4 border border-theme-border rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getMedicationTypeIcon(medication.type)}</div>
                            <div>
                              <h4 className="font-medium text-theme-text-primary">{medication.name}</h4>
                              <p className="text-sm text-theme-text-secondary">
                                {medication.dosage} • {medication.frequency}
                              </p>
                              <p className="text-xs text-blue-600">
                                Prescribed by {medication.prescribedBy}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMedicationStatusColor(medication.status)}`}>
                              {medication.status}
                            </span>
                            <p className="text-xs text-theme-text-secondary mt-1">
                              {new Date(medication.prescribedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Appointments */}
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-theme-text-primary">Recent Appointments</h3>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>

                  {userAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-theme-text-secondary mx-auto mb-3" />
                      <p className="text-theme-text-secondary">No appointments yet</p>
                      {user?.role === 'patient' && (
                        <button
                          onClick={() => setActiveTab('book-appointment')}
                          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Book Your First Appointment
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border border-theme-border rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-theme-text-secondary" />
                            <div>
                              <p className="font-medium text-theme-text-primary">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              <p className="text-sm text-theme-text-secondary">
                                {appointment.doctorName ? `${appointment.doctorName}` : 'Doctor consultation'} 
                                {appointment.doctorSpecialty && ` - ${appointment.doctorSpecialty}`}
                              </p>
                              {appointment.id && (
                                <p className="text-xs text-blue-600 font-mono">
                                  ID: {appointment.id}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <h3 className="text-xl font-bold text-theme-text-primary mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.role === 'patient' && (
                      <button
                        onClick={() => setActiveTab('book-appointment')}
                        className="flex items-center space-x-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium text-theme-text-primary">Book Appointment</p>
                          <p className="text-sm text-theme-text-secondary">Schedule with a doctor</p>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                    >
                      <User className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-theme-text-primary">Update Profile</p>
                        <p className="text-sm text-theme-text-secondary">Manage your information</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medications' && user?.role === 'patient' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Pill className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-theme-text-primary">My Medications</h2>
                  </div>
                  <div className="text-sm text-theme-text-secondary">
                    {activeMedications.length} active • {userMedications.length} total
                  </div>
                </div>

                {userMedications.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
                    <p className="text-theme-text-secondary text-lg">No medications prescribed yet</p>
                    <p className="text-theme-text-secondary mt-2">Your prescribed medications will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userMedications.map((medication) => (
                      <div
                        key={medication.id}
                        className="border border-theme-border rounded-lg p-6 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{getMedicationTypeIcon(medication.type)}</div>
                            <div>
                              <h3 className="text-xl font-semibold text-theme-text-primary">{medication.name}</h3>
                              <p className="text-blue-600 font-medium">{medication.dosage} • {medication.frequency}</p>
                              <p className="text-sm text-theme-text-secondary">
                                Prescribed by {medication.prescribedBy} on {new Date(medication.prescribedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMedicationStatusColor(medication.status)}`}>
                            {medication.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-theme-background p-3 rounded-lg border border-theme-border">
                            <h4 className="font-medium text-theme-text-primary mb-2">Instructions</h4>
                            <p className="text-sm text-theme-text-secondary">{medication.instructions}</p>
                          </div>
                          <div className="bg-theme-background p-3 rounded-lg border border-theme-border">
                            <h4 className="font-medium text-theme-text-primary mb-2">Duration</h4>
                            <p className="text-sm text-theme-text-secondary">{medication.duration}</p>
                          </div>
                        </div>

                        {medication.sideEffects && medication.sideEffects.length > 0 && (
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                            <h4 className="font-medium text-yellow-900 mb-2">Possible Side Effects</h4>
                            <div className="flex flex-wrap gap-2">
                              {medication.sideEffects.map((effect, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                >
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {medication.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">Doctor's Notes</h4>
                            <p className="text-sm text-blue-800">{medication.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-theme-text-primary">
                      {user?.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
                    </h2>
                  </div>
                  {user?.role === 'patient' && (
                    <button
                      onClick={() => setActiveTab('book-appointment')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Book New Appointment</span>
                    </button>
                  )}
                </div>

                {userAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
                    <p className="text-theme-text-secondary text-lg">No appointments yet</p>
                    <p className="text-theme-text-secondary mt-2 mb-4">
                      {user?.role === 'doctor' 
                        ? 'Patients will book appointments with you'
                        : 'Book your first appointment to get started'
                      }
                    </p>
                    {user?.role === 'patient' && (
                      <button
                        onClick={() => setActiveTab('book-appointment')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Book Your First Appointment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-theme-border rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-theme-text-secondary" />
                            <div>
                              <p className="font-medium text-theme-text-primary">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              <p className="text-sm text-theme-text-secondary">
                                {appointment.doctorName ? `${appointment.doctorName}` : 'Doctor consultation'} 
                                {appointment.doctorSpecialty && ` - ${appointment.doctorSpecialty}`}
                              </p>
                              {appointment.id && (
                                <p className="text-xs text-blue-600 font-mono">
                                  ID: {appointment.id}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="bg-theme-background p-3 rounded-lg border border-theme-border">
                          <div className="flex items-start space-x-2">
                            <FileText className="h-4 w-4 text-theme-text-secondary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-theme-text-primary">Symptoms/Notes:</p>
                              <p className="text-sm text-theme-text-secondary">{appointment.symptoms}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'book-appointment' && user?.role === 'patient' && (
              <div className="space-y-6">
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <div className="flex items-center space-x-3 mb-6">
                    <Plus className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-theme-text-primary">Book New Appointment</h2>
                  </div>

                  {/* Advanced Filters Component */}
                  <AdvancedDoctorFilter
                    doctors={mockDoctors}
                    onFilteredDoctors={handleFilteredDoctors}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                  />
                </div>

                {/* Doctors Results */}
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-theme-text-primary">
                      Available Doctors ({filteredDoctors.length})
                    </h3>
                    <div className="text-sm text-theme-text-secondary">
                      {filteredDoctors.length === mockDoctors.length 
                        ? 'Showing all doctors' 
                        : `Filtered from ${mockDoctors.length} total doctors`
                      }
                    </div>
                  </div>

                  {/* Doctors Grid */}
                  <div className="grid grid-cols-1 gap-6">
                    {filteredDoctors.map(doctor => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onBookAppointment={handleBookAppointment}
                      />
                    ))}
                  </div>

                  {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
                      <p className="text-theme-text-secondary text-lg">No doctors found matching your criteria</p>
                      <p className="text-theme-text-secondary mt-2">Try adjusting your search or filters to find more results.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'verification' && user?.role === 'doctor' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-theme-text-primary">Doctor Verification</h2>
                </div>

                {/* Verification Status Card */}
                <div className={`p-6 rounded-lg border-2 mb-6 ${getVerificationStatusColor(mockVerificationStatus)}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {getVerificationStatusIcon(mockVerificationStatus)}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {mockVerificationStatus === 'not_submitted' && 'Verification Not Started'}
                        {mockVerificationStatus === 'pending' && 'Verification Under Review'}
                        {mockVerificationStatus === 'approved' && 'Verification Approved'}
                        {mockVerificationStatus === 'rejected' && 'Verification Rejected'}
                      </h3>
                      <p className="text-sm opacity-80">
                        {mockVerificationStatus === 'not_submitted' && 'Submit your documents to get verified'}
                        {mockVerificationStatus === 'pending' && 'Your documents are being reviewed by our team'}
                        {mockVerificationStatus === 'approved' && 'Your account is verified and trusted'}
                        {mockVerificationStatus === 'rejected' && 'Please resubmit your documents with corrections'}
                      </p>
                    </div>
                  </div>

                  {mockVerificationStatus === 'not_submitted' && (
                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Verification Process
                    </button>
                  )}

                  {mockVerificationStatus === 'pending' && (
                    <div className="space-y-3">
                      <p className="text-sm">
                        We're reviewing your submitted documents. This process typically takes 24-48 hours.
                      </p>
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        View Submitted Documents
                      </button>
                    </div>
                  )}

                  {mockVerificationStatus === 'approved' && (
                    <div className="space-y-3">
                      <p className="text-sm">
                        Congratulations! Your account is now verified. Patients can see your verified badge.
                      </p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Verified Doctor</span>
                      </div>
                    </div>
                  )}

                  {mockVerificationStatus === 'rejected' && (
                    <div className="space-y-3">
                      <p className="text-sm">
                        Your verification was rejected. Please review the feedback and resubmit your documents.
                      </p>
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Resubmit Documents
                      </button>
                    </div>
                  )}
                </div>

                {/* Verification Benefits */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Benefits of Verification</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Verified badge displayed on your profile</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Higher visibility in search results</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Increased patient trust and bookings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Access to premium features</span>
                    </li>
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Medical License</p>
                        <p className="text-sm text-gray-600">Valid medical license document</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Medical Degree</p>
                        <p className="text-sm text-gray-600">Medical school diploma/certificate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Specialty Certificate</p>
                        <p className="text-sm text-gray-600">Specialty training certificate (optional)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Clinic Location</p>
                        <p className="text-sm text-gray-600">Valid clinic address with Google Maps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'clinic-location' && user?.role === 'doctor' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-theme-text-primary">Clinic Location Management</h2>
                </div>

                <div className="mb-6">
                  <p className="text-theme-text-secondary">
                    Manage your clinic's address and location information. This helps patients find your clinic 
                    and get accurate directions using Google Maps.
                  </p>
                </div>

                <DoctorLocationManager
                  currentAddress={currentDoctorAddress}
                  onSave={handleLocationSave}
                  isEditing={isEditingLocation}
                  onToggleEdit={() => setIsEditingLocation(!isEditingLocation)}
                />

                {!isEditingLocation && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Benefits of Setting Your Location</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Patients can easily find your clinic</li>
                      <li>• Integrated Google Maps directions</li>
                      <li>• Improved visibility in location-based searches</li>
                      <li>• Better patient experience and satisfaction</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-theme-text-primary">Profile</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-theme-text-primary mb-2">Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-theme-text-primary mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-theme-text-primary mb-2">Role</label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize bg-theme-background text-theme-text-primary"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-theme-border">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-theme-text-primary">Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-theme-border">
                    <div>
                      <h3 className="font-medium text-theme-text-primary">Email Notifications</h3>
                      <p className="text-sm text-theme-text-secondary">Receive notifications about appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-theme-border">
                    <div>
                      <h3 className="font-medium text-theme-text-primary">SMS Notifications</h3>
                      <p className="text-sm text-theme-text-secondary">Receive SMS reminders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        doctor={selectedDoctor}
        onBookAppointment={handleAppointmentSubmit}
      />

      {/* Verification Modal */}
      {showVerificationModal && (
        <DoctorVerification onClose={() => setShowVerificationModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;