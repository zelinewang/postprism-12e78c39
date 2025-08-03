import React from 'react';

interface AuroraBackgroundProps {
  isDark?: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ isDark = false }) => {
  return (
    <div className={`aurora-container ${isDark ? 'dark' : ''}`}>
      <div className="aurora-rays"></div>
    </div>
  );
};

export default AuroraBackground;