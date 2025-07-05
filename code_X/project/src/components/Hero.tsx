import React from 'react';
import { Search, Calendar, Shield, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const { theme } = useTheme();

  return (
    <section className="bg-gradient-to-br from-theme-primary to-theme-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-500">Your Health, Our</span>
            <span className={`${theme === 'green' ? 'text-green-800' : 'text-blue-600'}`}> Priority</span>
          </h1>
          <p className="text-xl text-theme-text-secondary mb-8 max-w-3xl mx-auto">
            Connect with verified doctors, book appointments instantly, and manage your healthcare journey with ease.
            Experience modern healthcare at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg">
              Learn More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-theme-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-2">Find Doctors</h3>
            <p className="text-theme-text-secondary">Search and filter doctors by specialty, location, fees, and ratings to find the perfect match.</p>
          </div>

          <div className="bg-theme-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-2">Book Appointments</h3>
            <p className="text-theme-text-secondary">Schedule appointments with your chosen doctors instantly with our easy-to-use booking system.</p>
          </div>

          <div className="bg-theme-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-2">Verified Doctors</h3>
            <p className="text-theme-text-secondary">All our doctors are verified professionals with proven credentials and excellent patient reviews.</p>
          </div>
        </div>

        <div className="mt-16 bg-theme-card rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-theme-text-secondary">Verified Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-theme-text-secondary">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-theme-text-secondary">Support Available</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                <span className="text-3xl font-bold text-yellow-600">4.9</span>
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
              </div>
              <div className="text-theme-text-secondary">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;