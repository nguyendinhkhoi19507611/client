
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
          },
          secondary: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
            950: '#4a044e'
          },
          accent: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22'
          },
          game: {
            stage: '#0a0a0a',
            piano: '#1a1a1a',
            keys: {
              white: '#f8fafc',
              black: '#1e293b',
              pressed: '#3b82f6'
            },
            led: {
              red: '#ef4444',
              orange: '#f97316',
              yellow: '#eab308',
              green: '#22c55e',
              blue: '#3b82f6',
              indigo: '#6366f1',
              purple: '#a855f7'
            }
          },
          coin: {
            gold: '#fbbf24',
            silver: '#e5e7eb',
            bronze: '#d97706'
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
          display: ['Orbitron', 'sans-serif']
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-out': 'fadeOut 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'slide-down': 'slideDown 0.3s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-subtle': 'bounceSubtle 1s ease-in-out',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'piano-key': 'pianoKey 0.1s ease-out',
          'coin-flip': 'coinFlip 0.6s ease-in-out',
          'led-pulse': 'ledPulse 1s ease-in-out infinite',
          'score-pop': 'scorePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          'combo-burst': 'comboBurst 0.5s ease-out',
          'achievement-unlock': 'achievementUnlock 0.8s ease-out',
          'particle-float': 'particleFloat 3s ease-in-out infinite'
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' }
          },
          fadeOut: {
            '0%': { opacity: '1' },
            '100%': { opacity: '0' }
          },
          slideUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          },
          slideDown: {
            '0%': { transform: 'translateY(-100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          },
          bounceSubtle: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' }
          },
          glow: {
            '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }
          },
          pianoKey: {
            '0%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(3px)' },
            '100%': { transform: 'translateY(0)' }
          },
          coinFlip: {
            '0%': { transform: 'rotateY(0deg)' },
            '100%': { transform: 'rotateY(360deg)' }
          },
          ledPulse: {
            '0%, 100%': { opacity: '0.6' },
            '50%': { opacity: '1' }
          },
          scorePop: {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          },
          comboBurst: {
            '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
            '100%': { transform: 'scale(1.5) rotate(10deg)', opacity: '0' }
          },
          achievementUnlock: {
            '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
            '50%': { transform: 'scale(1.1) rotate(-90deg)', opacity: '1' },
            '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
          },
          particleFloat: {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(-10px) rotate(120deg)' },
            '66%': { transform: 'translateY(5px) rotate(240deg)' }
          }
        },
        backdropBlur: {
          xs: '2px'
        },
        borderRadius: {
          '4xl': '2rem'
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem'
        },
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100'
        },
        screens: {
          'xs': '475px',
          '3xl': '1600px'
        },
        aspectRatio: {
          'piano': '7/2'
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
      // Custom plugin for piano-specific utilities
      function({ addUtilities, theme }) {
        const pianoUtilities = {
          '.piano-key-white': {
            background: theme('colors.game.keys.white'),
            border: `1px solid ${theme('colors.gray.300')}`,
            borderRadius: '0 0 4px 4px',
            transition: 'all 0.1s ease',
            '&:hover': {
              background: theme('colors.gray.100')
            },
            '&.pressed': {
              background: theme('colors.game.keys.pressed'),
              transform: 'translateY(2px)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }
          },
          '.piano-key-black': {
            background: theme('colors.game.keys.black'),
            border: `1px solid ${theme('colors.gray.600')}`,
            borderRadius: '0 0 2px 2px',
            transition: 'all 0.1s ease',
            '&:hover': {
              background: theme('colors.gray.700')
            },
            '&.pressed': {
              background: theme('colors.game.keys.pressed'),
              transform: 'translateY(1px)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }
          },
          '.led-ring': {
            borderRadius: '50%',
            animation: `${theme('animation.led-pulse')}`,
            filter: 'blur(1px)'
          },
          '.game-stage': {
            background: `linear-gradient(135deg, ${theme('colors.game.stage')} 0%, ${theme('colors.gray.900')} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
              pointerEvents: 'none'
            }
          },
          '.coin-particle': {
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: theme('colors.coin.gold'),
            borderRadius: '50%',
            animation: `${theme('animation.particle-float')}`,
            boxShadow: '0 0 6px rgba(251, 191, 36, 0.6)'
          },
          '.glass-morphism': {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: theme('borderRadius.xl')
          }
        }
        
        addUtilities(pianoUtilities)
      }
    ]
  }