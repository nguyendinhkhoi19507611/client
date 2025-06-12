// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  User, 
  Settings, 
  LogOut, 
  Coins, 
  Crown, 
  Shield,
  ChevronDown,
  Menu,
  X,
  Home,
  Library,
  Trophy,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import Button from '../UI/Button';
import { formatNumber } from '../../utils/formatters';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, getBalanceInfo } = useAuth();
  const { t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const balance = getBalanceInfo();

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.music'), href: '/music', icon: Library },
    { name: t('nav.leaderboard'), href: '/leaderboard', icon: Trophy },
  ];

  const userNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: User },
    { name: t('nav.profile'), href: '/profile', icon: Settings },
    { name: t('nav.payments'), href: '/payment', icon: CreditCard },
  ];

  // Add admin navigation if user is admin
  if (user?.role === 'admin') {
    userNavigation.push({
      name: t('nav.admin'),
      href: '/admin',
      icon: Shield
    });
  }

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2 group-hover:scale-105 transition-transform">
              <Music className="w-full h-full text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BigCoin Piano
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Mine & Play</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher className="hidden sm:block" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Balance Display */}
                <div className="hidden lg:flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">
                    {formatNumber(balance.available)}
                  </span>
                  <span className="text-yellow-400 text-sm">BC</span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-white text-sm font-medium flex items-center">
                        {user.username}
                        {user.subscriptions?.premium?.active && (
                          <Crown className="w-4 h-4 text-yellow-400 ml-1" />
                        )}
                        {user.role === 'admin' && (
                          <Shield className="w-4 h-4 text-red-400 ml-1" />
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Level {user.statistics?.level || 1}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-20"
                        >
                          {/* User Info */}
                          <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <div className="text-white font-medium flex items-center">
                                  {user.fullName}
                                  {user.subscriptions?.premium?.active && (
                                    <Crown className="w-4 h-4 text-yellow-400 ml-1" />
                                  )}
                                </div>
                                <div className="text-gray-400 text-sm">@{user.username}</div>
                                <div className="text-green-400 text-xs">
                                  {formatNumber(balance.available)} BC
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Links */}
                          <div className="py-2">
                            {userNavigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                              </Link>
                            ))}
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-gray-700">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors"
                            >
                              <LogOut className="w-5 h-5" />
                              <span>{t('nav.logout')}</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-800 py-4"
            >
              <div className="space-y-2">
                {/* Main Navigation */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActivePath(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* User Navigation */}
                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="flex items-center space-x-3 px-4 py-2 mb-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{user.fullName}</div>
                          <div className="text-green-400 text-sm">
                            {formatNumber(balance.available)} BC
                          </div>
                        </div>
                      </div>
                      
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg mt-2"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Auth Buttons for Mobile */}
                {!isAuthenticated && (
                  <div className="border-t border-gray-800 pt-4 mt-4 space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        navigate('/login');
                        setShowMobileMenu(false);
                      }}
                    >
                      {t('nav.login')}
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/register');
                        setShowMobileMenu(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {t('nav.register')}
                    </Button>
                  </div>
                )}

                {/* Language Switcher for Mobile */}
                <div className="border-t border-gray-800 pt-4 mt-4">
                  <LanguageSwitcher variant="buttons" className="px-4" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;