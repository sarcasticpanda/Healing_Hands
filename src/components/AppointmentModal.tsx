import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { Doctor } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookAppointment: (appointmentData: any) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onBookAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !symptoms) return;

    const appointmentData = {
      doctorId: doctor?.id,
      date: selectedDate,
      time: selectedTime,
      symptoms,
      status: 'pending',
    };

    onBookAppointment(appointmentData);
  };

  if (!isOpen || !doctor) return null;

  // Generate available dates (next 30 days)
  const availableDates = [];
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    availableDates.push(date.toISOString().split('T')[0]);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-card rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text-primary">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-theme-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          {/* Doctor Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-theme-background rounded-lg border border-theme-border">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-theme-text-primary">{doctor.name}</h3>
              <p className="text-blue-600">{doctor.speciality}</p>
              <p className="text-sm text-theme-text-secondary">₹{doctor.fees} consultation fee</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-theme-text-primary mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                required
              >
                <option value="">Choose a date</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text-primary mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Select Time
              </label>
              <div className="grid grid-cols-2 gap-3">
                {doctor.availableSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 transition-colors text-center ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-theme-border hover:bg-theme-hover text-theme-text-primary'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text-primary mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Describe your symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                placeholder="Please describe your symptoms, concerns, or reason for the appointment..."
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Specialty:</strong> {doctor.speciality}</p>
                {selectedDate && (
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                )}
                {selectedTime && <p><strong>Time:</strong> {selectedTime}</p>}
                <p><strong>Consultation Fee:</strong> ₹{doctor.fees}</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;