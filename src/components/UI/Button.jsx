// client/src/components/UI/Button.jsx - Reusable button component
import React from 'react';
import clsx from 'clsx';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500 bg-transparent',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const buttonClasses = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'w-full': fullWidth,
      'opacity-50 cursor-not-allowed': disabled || loading
    },
    className
  );

  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner size="sm" color="white" className="mr-2" />;
    }
    
    if (icon) {
      return React.cloneElement(icon, {
        className: clsx(
          iconSizes[size],
          {
            'mr-2': iconPosition === 'left' && children,
            'ml-2': iconPosition === 'right' && children
          }
        )
      });
    }
    
    return null;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150 rounded-lg" />
      
      {/* Content */}
      {iconPosition === 'left' && renderIcon()}
      {children && <span className={loading ? 'opacity-0' : ''}>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
    </button>
  );
};

export default Button;