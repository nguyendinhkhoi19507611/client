// 404 Not Found page
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Music } from 'lucide-react';
import Button from '../../components/UI/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text">
              404
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Music className="w-16 h-16 text-blue-400 opacity-30" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            The page you're looking for seems to have vanished into thin air.
          </p>
          <p className="text-gray-400">
            Maybe it's taking a piano lesson? 🎹
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              icon={<Home className="w-5 h-5" />}
            >
              Go Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Go Back
            </Button>
          </div>
          
          <Button
            onClick={() => navigate('/music')}
            variant="ghost"
            className="text-blue-400 hover:text-blue-300"
          >
            Browse Music Library
          </Button>
        </motion.div>

        {/* Floating Musical Notes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                y: '100vh',
                x: `${Math.random() * 100}vw`
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: '-10vh',
                rotate: 360
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear'
              }}
              className="absolute text-4xl text-blue-400/20"
            >
              {['♪', '♫', '♬', '♩', '♯', '♭'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;