// src/pages/Home/HomePage.jsx - Updated with complete translations
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Coins, 
  Trophy, 
  Users, 
  Music, 
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatNumber } from '../../utils/formatters';
import Button from '../../components/UI/Button';

// Mock music service for now
const mockMusicService = {
  getMusicStats: () => Promise.resolve({
    stats: {
      totalSongs: 1234,
      totalArtists: 456,
      totalGenres: 12,
      totalPlays: 98765
    }
  })
};

// Simple useQuery implementation for this component
const useQuery = (key, queryFn, options = {}) => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    if (typeof queryFn === 'function') {
      Promise.resolve(queryFn())
        .then(result => {
          setData(result);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, []);
  
  return { data, isLoading, error };
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Brand */}
          <motion.div
            className="mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-4 mb-6">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <Music className="w-16 h-16 text-gray-800" />
              </div>
            </div>
            <h1 className="text-6xl font-bold font-display bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
          </motion.div>

          {/* Dynamic Slides */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}>
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-4"
              >
                <Play className="w-6 h-6 mr-2" />
                {t('hero.startPlaying')}
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                >
                  {t('hero.getStarted')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/music')}
                  className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10"
                >
                  {t('hero.browseMusic')}
                </Button>
              </>
            )}
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.earnRealMoney.title')}</h3>
              <p className="text-gray-300">{t('features.earnRealMoney.description')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.globalCompetition.title')}</h3>
              <p className="text-gray-300">{t('features.globalCompetition.description')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.vastMusicLibrary.title')}</h3>
              <p className="text-gray-300">{t('features.vastMusicLibrary.description')}</p>
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: t('features.realTimeMining.title'),
      description: t('features.realTimeMining.description'),
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: t('features.secureBlockchain.title'),
      description: t('features.secureBlockchain.description'),
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: t('features.globalCommunity.title'),
      description: t('features.globalCommunity.description'),
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('features.multiplayerModes.title'),
      description: t('features.multiplayerModes.description'),
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:transform group-hover:scale-105">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const { t, formatNumber } = useLanguage();
  const { data: musicStats } = useQuery(
    'musicStats',
    () => mockMusicService.getMusicStats(),
    { staleTime: 5 * 60 * 1000 }
  );

  const stats = [
    {
      value: musicStats?.stats?.totalSongs ? formatNumber(musicStats.stats.totalSongs) : "1,000+",
      label: t('stats.songsAvailable'),
      icon: <Music className="w-8 h-8" />
    },
    {
      value: "50K+",
      label: t('stats.activePlayers'),
      icon: <Users className="w-8 h-8" />
    },
    {
      value: "$100K+",
      label: t('stats.rewardsPaid'),
      icon: <Coins className="w-8 h-8" />
    },
    {
      value: "24/7",
      label: t('stats.miningActive'),
      icon: <Zap className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: t('testimonials.testimonial1.name'),
      role: t('testimonials.testimonial1.role'),
      content: t('testimonials.testimonial1.content'),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
      name: t('testimonials.testimonial2.name'),
      role: t('testimonials.testimonial2.role'),
      content: t('testimonials.testimonial2.content'),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      name: t('testimonials.testimonial3.name'),
      role: t('testimonials.testimonial3.role'),
      content: t('testimonials.testimonial3.content'),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-300">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                {t('cta.goToDashboard')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  {t('cta.startPlayingNow')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                >
                  {t('cta.signIn')}
                </Button>
              </>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center text-blue-100">
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('cta.noCreditCard')}
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('cta.instantRewards')}
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('cta.secureVerified')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main HomePage Component
const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;