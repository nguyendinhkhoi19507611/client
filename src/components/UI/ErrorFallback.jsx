// client/src/components/UI/ErrorFallback.jsx - Error boundary fallback component
import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const handleGoHome = () => {
    // Use window.location instead of useNavigate since this might be outside Router context
    window.location.href = '/';
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        {/* Error Message */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-300 mb-6">
          We're sorry for the inconvenience. The application encountered an unexpected error.
        </p>
        
        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-400 cursor-pointer mb-2">
              Error Details
            </summary>
            <div className="bg-gray-900/50 rounded-lg p-3 text-xs text-red-300 overflow-auto max-h-32">
              <pre>{error.toString()}</pre>
            </div>
          </details>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={handleReload}
            className="w-full text-gray-400 hover:text-white py-2 transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
        
        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;