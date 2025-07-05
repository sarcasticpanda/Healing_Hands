import React from 'react';
import { Heart, User, LogOut, Menu, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onAuthClick: () => void;
  onDashboardClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick, onDashboardClick }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-theme-card shadow-sm border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-theme-text-primary">Healing Hands</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-theme-text-secondary hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#doctors" className="text-theme-text-secondary hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Find Doctors
            </a>
            <a href="#about" className="text-theme-text-secondary hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </a>
            <a href="#contact" className="text-theme-text-secondary hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </a>
            {isAuthenticated && user?.role === 'patient' && onDashboardClick && (
              <button
                onClick={onDashboardClick}
                className="flex items-center space-x-2 text-theme-text-secondary hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-theme-text-secondary" />
                  <span className="text-sm font-medium text-theme-text-primary">{user?.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                </div>
                {user?.role === 'patient' && onDashboardClick && (
                  <button
                    onClick={onDashboardClick}
                    className="hidden sm:flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-theme-text-secondary hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
            )}
            <button className="md:hidden p-2 rounded-md text-theme-text-secondary hover:text-theme-text-primary">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;