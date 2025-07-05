import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Settings, LogOut, Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAppointments, mockDoctors } from '../data/mockData';
import { Doctor } from '../types';
import DoctorCard from './DoctorCard';
import AppointmentModal from './AppointmentModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const userAppointments = mockAppointments.filter(
    appointment => appointment.patientId === user?.id || appointment.doctorId === user?.id
  );

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    alert('Appointment booked successfully!');
    setShowAppointmentModal(false);
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
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'appointments'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-theme-text-secondary hover:bg-theme-hover'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>My Appointments</span>
              </button>

              {user?.role === 'patient' && (
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
                                {user?.role === 'doctor' ? 'Patient appointment' : 'Doctor consultation'}
                              </p>
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
              <div className="bg-theme-card rounded-xl shadow-lg p-6 border border-theme-border">
                <div className="flex items-center space-x-3 mb-6">
                  <Plus className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-theme-text-primary">Book New Appointment</h2>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-theme-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search doctors by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    />
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
                    <p className="text-theme-text-secondary text-lg">No doctors found</p>
                    <p className="text-theme-text-secondary mt-2">Try adjusting your search terms.</p>
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

export default Dashboard;