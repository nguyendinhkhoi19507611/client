// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';

// Providers and Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { AudioProvider } from './contexts/AudioContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorFallback from './components/UI/ErrorFallback';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/Home/HomePage'));
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/Auth/RegisterPage'));
const GamePage = React.lazy(() => import('./pages/Game/GamePage'));
const MusicLibraryPage = React.lazy(() => import('./pages/Music/MusicLibraryPage'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard/DashboardPage'));
const PaymentPage = React.lazy(() => import('./pages/Payment/PaymentPage'));
const AdminPanelPage = React.lazy(() => import('./pages/Admin/AdminPanelPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound/NotFoundPage'));

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Global Styles
import './styles/globals.css';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// App Loading Screen Component
const AppLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        {/* Piano Logo Animation */}
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-pulse">
            <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
              <div className="w-16 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg relative overflow-hidden">
                {/* Piano Keys */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-lg flex">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-gray-300 last:border-r-0" />
                  ))}
                </div>
                {/* Black Keys */}
                <div className="absolute bottom-4 left-0 right-0 h-4 flex justify-around px-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 bg-gray-800 rounded-b" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h1 className="text-4xl font-bold text-white mb-2 font-display">
          BigCoin Piano
        </h1>
        <p className="text-blue-300 text-lg mb-6">
          Mining the rhythm of success
        </p>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="lg" className="mb-4" />
        
        {/* Loading Progress */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse w-3/4 transition-all duration-1000" />
          </div>
          <p className="text-sm text-gray-400 mt-2">Loading game assets...</p>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error Boundary:', error, errorInfo);
      }}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <ThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <AudioProvider>
                    <GameProvider>
                      <div className="App min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                        <Suspense fallback={<AppLoadingScreen />}>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Layout />}>
                              <Route index element={<HomePage />} />
                              <Route path="login" element={<LoginPage />} />
                              <Route path="register" element={<RegisterPage />} />
                              <Route path="music" element={<MusicLibraryPage />} />
                              
                              {/* Protected Routes */}
                              <Route path="dashboard" element={
                                <ProtectedRoute>
                                  <DashboardPage />
                                </ProtectedRoute>
                              } />
                              
                              <Route path="game" element={
                                <ProtectedRoute>
                                  <GamePage />
                                </ProtectedRoute>
                              } />
                              
                              <Route path="payment" element={
                                <ProtectedRoute>
                                  <PaymentPage />
                                </ProtectedRoute>
                              } />
                              
                              {/* Admin Only Routes */}
                              <Route path="admin" element={
                                <ProtectedRoute>
                                  <AdminRoute>
                                    <AdminPanelPage />
                                  </AdminRoute>
                                </ProtectedRoute>
                              } />
                              
                              {/* Redirects */}
                              <Route path="music/:id" element={<Navigate to="/game" replace />} />
                              <Route path="404" element={<NotFoundPage />} />
                              <Route path="*" element={<Navigate to="/404" replace />} />
                            </Route>
                          </Routes>
                        </Suspense>

                        {/* Global Toast Notifications */}
                        <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 4000,
                            style: {
                              background: 'rgba(0, 0, 0, 0.8)',
                              color: '#fff',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '12px'
                            },
                            success: {
                              iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff'
                              }
                            },
                            error: {
                              iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff'
                              }
                            }
                          }}
                        />

                        {/* Global Audio Context (for piano sounds) */}
                        <div id="audio-context" className="hidden" />
                        
                        {/* Game Canvas Container */}
                        <div id="game-canvas" className="fixed inset-0 pointer-events-none z-0" />
                        
                        {/* Particle Effects Container */}
                        <div id="particle-effects" className="fixed inset-0 pointer-events-none z-50" />
                      </div>
                    </GameProvider>
                  </AudioProvider>
                </AuthProvider>
              </LanguageProvider>
            </ThemeProvider>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;