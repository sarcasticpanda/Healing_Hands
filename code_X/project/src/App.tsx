import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import AuthModal from './components/AuthModal';
import DoctorSearch from './components/DoctorSearch';
import AppointmentModal from './components/AppointmentModal';
import Dashboard from './components/Dashboard';
import { Doctor } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    console.log('Appointment booked:', appointmentData);
    // In a real app, this would make an API call to save the appointment
    alert('Appointment booked successfully!');
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-theme-background">
      <Header onAuthClick={handleAuthClick} />
      <Hero onGetStarted={handleAuthClick} />
      <DoctorSearch onBookAppointment={handleBookAppointment} />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        doctor={selectedDoctor}
        onBookAppointment={handleAppointmentSubmit}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;