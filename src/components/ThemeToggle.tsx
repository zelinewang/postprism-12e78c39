import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <div className="theme-toggle">
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={isDark}
          onChange={onToggle}
          className="theme-checkbox"
        />
        <div className="switch-slider"></div>
        <span className="switch-label">
          <span className="switch-option">Light</span>
          <span className="switch-option">Dark</span>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;