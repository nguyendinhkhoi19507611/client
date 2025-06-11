// client/src/components/UI/LoadingSpinner.jsx - Loading spinner component
import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '', 
  text = '',
  fullScreen = false 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-purple-600',
    accent: 'border-green-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const spinnerClasses = clsx(
    'animate-spin rounded-full border-2 border-gray-300',
    'border-t-transparent',
    sizes[size],
    colors[color],
    className
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={spinnerClasses} />
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;