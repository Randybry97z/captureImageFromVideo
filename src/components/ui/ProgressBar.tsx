import React from 'react';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className ?? ''}`}>
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

export default ProgressBar; 