import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    speciality: '',
    experience: '',
    fees: '',
    location: '',
    phone: '',
    age: '',
    gender: 'male',
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(formData.email, formData.password, role);
      if (success) {
        onClose();
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const success = await register({ ...formData, role });
      if (success) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-theme-border">
        <div className="flex justify-between items-center p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text-primary">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-theme-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-theme-text-primary mb-2">
              I am a:
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  role === 'patient'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-theme-border hover:bg-theme-hover text-theme-text-primary'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  role === 'doctor'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-theme-border hover:bg-theme-hover text-theme-text-primary'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-theme-text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-theme-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-theme-text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-theme-background text-theme-text-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-theme-text-secondary" />
                ) : (
                  <Eye className="h-5 w-5 text-theme-text-secondary" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-theme-text-primary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                required
              />
            </div>
          )}

          {!isLogin && role === 'doctor' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-theme-text-primary mb-2">
                  Speciality
                </label>
                <select
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                  required
                >
                  <option value="">Select Speciality</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text-primary mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-text-primary mb-2">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-theme-text-primary mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                  required
                />
              </div>
            </>
          )}

          {!isLogin && role === 'patient' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text-primary mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-text-primary mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-theme-text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-background text-theme-text-primary"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-theme-text-secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;