import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Settings, LogOut, Search, Plus, Map, Activity, TrendingUp, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAppointments, mockDoctors } from '../data/mockData';
import { Doctor } from '../types';
import DoctorCard from './DoctorCard';
import AppointmentModal from './AppointmentModal';
import MapSearch from './MapSearch';
import SpecialtyFilter from './SpecialtyFilter';

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'list' | 'map'>('list');
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const userAppointments = mockAppointments.filter(
    appointment => appointment.patientId === user?.id
  );

  // Get recent appointments (last 30 days)
  const recentAppointments = userAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return appointmentDate >= thirtyDaysAgo;
  });

  // Get upcoming appointments
  const upcomingAppointments = userAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return appointmentDate >= today;
  });

  // Filter doctors based on search term and selected specialties
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialties.length === 0 || 
                           selectedSpecialties.includes(doctor.speciality);

    return matchesSearch && matchesSpecialty;
  });

  // Count doctors by specialty for the filter component
  const doctorCounts = mockDoctors.reduce((acc, doctor) => {
    acc[doctor.speciality] = (acc[doctor.speciality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    alert('Appointment booked successfully!');
    setShowAppointmentModal(false);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
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
                {upcomingAppointments.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {upcomingAppointments.length}
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
                      <p className="text-blue-100">Manage your health appointments and track your wellness journey.</p>
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
                        <p className="text-theme-text-secondary text-sm font-medium">Upcoming Appointments</p>
                        <p className="text-2xl font-bold text-theme-text-primary">{upcomingAppointments.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-theme-text-secondary text-sm font-medium">Recent Visits</p>
                        <p className="text-2xl font-bold text-theme-text-primary">{recentAppointments.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-theme-text-secondary text-sm font-medium">Health Score</p>
                        <p className="text-2xl font-bold text-theme-text-primary">85%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

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

                  {recentAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-theme-text-secondary mx-auto mb-3" />
                      <p className="text-theme-text-secondary">No recent appointments</p>
                      <button
                        onClick={() => setActiveTab('book-appointment')}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentAppointments.slice(0, 3).map((appointment) => (
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
                              <p className="text-sm text-theme-text-secondary">Doctor consultation</p>
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

            {activeTab === 'appointments' && (
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-theme-text-primary">My Appointments</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('book-appointment')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Book New Appointment</span>
                  </button>
                </div>

                {userAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
                    <p className="text-theme-text-secondary text-lg">No appointments yet</p>
                    <p className="text-theme-text-secondary mt-2 mb-4">Book your first appointment to get started</p>
                    <button
                      onClick={() => setActiveTab('book-appointment')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Your First Appointment
                    </button>
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
                              <p className="text-sm text-theme-text-secondary">Doctor consultation</p>
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

            {activeTab === 'book-appointment' && (
              <div className="space-y-6">
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Plus className="h-6 w-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-theme-text-primary">Book New Appointment</h2>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSearchMode('list')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          searchMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-theme-background text-theme-text-secondary hover:bg-theme-hover'
                        }`}
                      >
                        <Search className="h-4 w-4" />
                        <span>List View</span>
                      </button>
                      <button
                        onClick={() => setSearchMode('map')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          searchMode === 'map'
                            ? 'bg-blue-600 text-white'
                            : 'bg-theme-background text-theme-text-secondary hover:bg-theme-hover'
                        }`}
                      >
                        <Map className="h-4 w-4" />
                        <span>Map View</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-theme-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search doctors by name, specialty, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                      />
                    </div>
                  </div>

                  {/* Specialty Filter */}
                  <SpecialtyFilter
                    selectedSpecialties={selectedSpecialties}
                    onSpecialtyToggle={handleSpecialtyToggle}
                    doctorCounts={doctorCounts}
                  />
                </div>

                {/* Search Results */}
                <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-theme-text-primary">
                      Available Doctors ({filteredDoctors.length})
                    </h3>
                    {searchMode === 'map' && (
                      <div className="flex items-center space-x-2 text-sm text-theme-text-secondary">
                        <Map className="h-4 w-4" />
                        <span>Click markers to view doctor details</span>
                      </div>
                    )}
                  </div>

                  {searchMode === 'map' ? (
                    <MapSearch
                      doctors={filteredDoctors}
                      onDoctorSelect={handleBookAppointment}
                      searchRadius={searchRadius}
                      onRadiusChange={setSearchRadius}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredDoctors.map(doctor => (
                        <DoctorCard
                          key={doctor.id}
                          doctor={doctor}
                          onBookAppointment={handleBookAppointment}
                        />
                      ))}
                    </div>
                  )}

                  {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-16 w-16 text-theme-text-secondary mx-auto mb-4" />
                      <p className="text-theme-text-secondary text-lg">No doctors found</p>
                      <p className="text-theme-text-secondary mt-2">Try adjusting your search terms or filters.</p>
                    </div>
                  )}
                </div>
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
    </div>
  );
};

export default PatientDashboard;