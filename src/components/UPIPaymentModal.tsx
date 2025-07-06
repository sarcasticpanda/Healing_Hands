import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Copy, Clock, ArrowRight, SkipForward } from 'lucide-react';
import { Doctor } from '../types';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  appointmentData: any;
  onPaymentSuccess: (appointmentId: string) => void;
}

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  doctor,
  appointmentData,
  onPaymentSuccess,
}) => {
  const [paymentStep, setPaymentStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
  const [upiId, setUpiId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', logo: '🟢' },
    { id: 'phonepe', name: 'PhonePe', logo: '🟣' },
    { id: 'paytm', name: 'Paytm', logo: '🔵' },
    { id: 'bhim', name: 'BHIM UPI', logo: '🟠' },
    { id: 'other', name: 'Other UPI App', logo: '💳' },
  ];

  const generateAppointmentId = () => {
    const prefix = 'APT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handlePayment = () => {
    if (!selectedUPIApp && !upiId) {
      alert('Please select a UPI app or enter UPI ID');
      return;
    }

    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const newAppointmentId = generateAppointmentId();
      setAppointmentId(newAppointmentId);
      setPaymentStep('success');
      
      // Call success callback after a short delay
      setTimeout(() => {
        onPaymentSuccess(newAppointmentId);
      }, 2000);
    }, 3000);
  };

  const handleSkipPayment = () => {
    // Skip payment and directly generate appointment ID
    const newAppointmentId = generateAppointmentId();
    setAppointmentId(newAppointmentId);
    setPaymentStep('success');
    
    // Call success callback after a short delay
    setTimeout(() => {
      onPaymentSuccess(newAppointmentId);
    }, 1500);
  };

  const copyAppointmentId = () => {
    navigator.clipboard.writeText(appointmentId);
    alert('Appointment ID copied to clipboard!');
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text-primary">
            {paymentStep === 'payment' && 'Payment Options'}
            {paymentStep === 'processing' && 'Processing...'}
            {paymentStep === 'success' && 'Booking Confirmed!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-theme-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          {paymentStep === 'payment' && (
            <div className="space-y-6">
              {/* Appointment Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Appointment Summary</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specialty:</span>
                    <span>{doctor.speciality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{appointmentData?.date ? new Date(appointmentData.date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{appointmentData?.time || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-300 pt-2 mt-2">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">₹{doctor.fees}</span>
                  </div>
                </div>
              </div>

              {/* Skip Payment Option - Prominent */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <SkipForward className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">Trial Mode - Skip Payment</h3>
                    <p className="text-sm text-green-700">Book appointment instantly without payment</p>
                  </div>
                </div>
                <button
                  onClick={handleSkipPayment}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <SkipForward className="h-5 w-5" />
                  <span>Skip Payment & Book Now</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-theme-border"></div>
                <span className="text-sm text-theme-text-secondary">OR</span>
                <div className="flex-1 h-px bg-theme-border"></div>
              </div>

              {/* UPI Payment Options */}
              <div>
                <h3 className="font-medium text-theme-text-primary mb-3">Pay with UPI</h3>
                
                {/* UPI Apps */}
                <div className="space-y-3 mb-4">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUPIApp(app.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        selectedUPIApp === app.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-theme-border hover:border-blue-300'
                      }`}
                    >
                      <span className="text-2xl">{app.logo}</span>
                      <span className="font-medium text-theme-text-primary">{app.name}</span>
                      {selectedUPIApp === app.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Manual UPI ID */}
                <div className="border-t border-theme-border pt-4">
                  <label className="block text-sm font-medium text-theme-text-primary mb-2">
                    Or enter UPI ID manually
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      if (e.target.value) setSelectedUPIApp('');
                    }}
                    placeholder="yourname@upi"
                    className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                  />
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedUPIApp && !upiId}
                  className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Pay ₹{doctor.fees}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Trial Notice */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Demo Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This is a trial version. You can skip payment or use the demo payment flow.
                </p>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-theme-text-primary mb-2">Processing...</h3>
              <p className="text-theme-text-secondary">Confirming your appointment booking</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Appointment Booked Successfully!</h3>
              <p className="text-theme-text-secondary mb-6">Your appointment has been confirmed</p>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <h4 className="font-medium text-green-900 mb-3">Appointment Details</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-center justify-between">
                    <span>Appointment ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-lg">{appointmentId}</span>
                      <button
                        onClick={copyAppointmentId}
                        className="p-1 hover:bg-green-200 rounded transition-colors"
                        title="Copy Appointment ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{appointmentData?.date ? new Date(appointmentData.date).toLocaleDateString() : 'N/A'} at {appointmentData?.time || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-bold text-green-600">Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">What's Next?</span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Check "My Appointments" section for details</li>
                  <li>• Arrive 15 minutes early for your appointment</li>
                  <li>• Bring a valid ID and your appointment ID</li>
                  <li>• You can reschedule if needed from your dashboard</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Go to My Appointments
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;