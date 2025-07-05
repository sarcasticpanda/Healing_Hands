import React from 'react';
import { Moon, Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'green', icon: Leaf, label: 'Green', color: 'text-green-500' },
    { name: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-400' },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-theme-card border border-theme-border rounded-lg p-1 shadow-sm">
      {themes.map(({ name, icon: Icon, label, color }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === name
              ? 'bg-blue-600 text-white shadow-sm'
              : `text-theme-text-secondary hover:bg-theme-hover ${color}`
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;