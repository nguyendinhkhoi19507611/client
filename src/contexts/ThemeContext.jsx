// Theme management context
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext();

// Theme Actions
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_CUSTOM_COLORS: 'SET_CUSTOM_COLORS',
  RESET_THEME: 'RESET_THEME'
};

// Available themes
const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto'
};

// Theme presets
const THEME_PRESETS = {
  default: {
    name: 'Default',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb'
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#0c1426',
      surface: '#1e293b',
      text: '#f1f5f9'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#ec4899',
      accent: '#eab308',
      background: '#1c1917',
      surface: '#292524',
      text: '#fafaf9'
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '#22c55e',
      secondary: '#84cc16',
      accent: '#10b981',
      background: '#14120b',
      surface: '#1c1a15',
      text: '#fafaf9'
    }
  },
  purple: {
    name: 'Purple',
    colors: {
      primary: '#a855f7',
      secondary: '#d946ef',
      accent: '#c084fc',
      background: '#1e1024',
      surface: '#2a1f3d',
      text: '#faf7ff'
    }
  }
};

// Initial State
const initialState = {
  currentTheme: THEMES.DARK,
  currentPreset: 'default',
  customColors: {},
  systemPreference: THEMES.DARK,
  presets: THEME_PRESETS
};

// Theme Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        currentTheme: action.payload
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      return {
        ...state,
        currentTheme: newTheme
      };

    case THEME_ACTIONS.SET_CUSTOM_COLORS:
      return {
        ...state,
        customColors: {
          ...state.customColors,
          ...action.payload
        }
      };

    case THEME_ACTIONS.RESET_THEME:
      return {
        ...state,
        currentTheme: THEMES.DARK,
        currentPreset: 'default',
        customColors: {}
      };

    default:
      return state;
  }
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPreference = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    
    dispatch({ 
      type: THEME_ACTIONS.SET_THEME, 
      payload: systemPreference 
    });

    const handleChange = (e) => {
      if (state.currentTheme === THEMES.AUTO) {
        const newPreference = e.matches ? THEMES.DARK : THEMES.LIGHT;
        dispatch({ 
          type: THEME_ACTIONS.SET_THEME, 
          payload: newPreference 
        });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.currentTheme]);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedPreset = localStorage.getItem('themePreset');
    const savedCustomColors = localStorage.getItem('customColors');

    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: savedTheme });
    }

    if (savedPreset && THEME_PRESETS[savedPreset]) {
      setThemePreset(savedPreset);
    }

    if (savedCustomColors) {
      try {
        const customColors = JSON.parse(savedCustomColors);
        dispatch({ type: THEME_ACTIONS.SET_CUSTOM_COLORS, payload: customColors });
      } catch (error) {
        console.error('Failed to parse custom colors:', error);
      }
    }
  }, []);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('theme', state.currentTheme);
    
    // Apply theme class to document
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    
    if (state.currentTheme === THEMES.AUTO) {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
      html.classList.add(systemPreference);
    } else {
      html.classList.add(state.currentTheme);
    }
  }, [state.currentTheme]);

  // Apply custom colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const currentPreset = THEME_PRESETS[state.currentPreset] || THEME_PRESETS.default;
    
    // Apply preset colors
    const colors = { ...currentPreset.colors, ...state.customColors };
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [state.currentPreset, state.customColors]);

  // Set theme
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  // Set theme preset
  const setThemePreset = (presetName) => {
    if (THEME_PRESETS[presetName]) {
      dispatch({ 
        type: THEME_ACTIONS.SET_THEME, 
        payload: { ...state, currentPreset: presetName }
      });
      localStorage.setItem('themePreset', presetName);
    }
  };

  // Set custom colors
  const setCustomColors = (colors) => {
    dispatch({ type: THEME_ACTIONS.SET_CUSTOM_COLORS, payload: colors });
    localStorage.setItem('customColors', JSON.stringify({ ...state.customColors, ...colors }));
  };

  // Reset theme
  const resetTheme = () => {
    dispatch({ type: THEME_ACTIONS.RESET_THEME });
    localStorage.removeItem('theme');
    localStorage.removeItem('themePreset');
    localStorage.removeItem('customColors');
  };

  // Get current theme colors
  const getCurrentColors = () => {
    const currentPreset = THEME_PRESETS[state.currentPreset] || THEME_PRESETS.default;
    return { ...currentPreset.colors, ...state.customColors };
  };

  // Check if dark theme
  const isDark = () => {
    if (state.currentTheme === THEMES.AUTO) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return state.currentTheme === THEMES.DARK;
  };

  // Check if light theme
  const isLight = () => {
    return !isDark();
  };

  // Get theme-aware color
  const getColor = (colorName, opacity = 1) => {
    const colors = getCurrentColors();
    const color = colors[colorName];
    
    if (!color) return colorName;
    
    if (opacity === 1) return color;
    
    // Convert hex to rgba with opacity
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Generate theme-aware gradient
  const getGradient = (from, to, direction = 'to right') => {
    const fromColor = getColor(from);
    const toColor = getColor(to);
    return `linear-gradient(${direction}, ${fromColor}, ${toColor})`;
  };

  // Get contrasting text color
  const getContrastColor = (backgroundColor) => {
    const colors = getCurrentColors();
    
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? colors.text : '#ffffff';
  };

  // Apply theme to component styles
  const getThemedStyles = (baseStyles = {}) => {
    const colors = getCurrentColors();
    const themedStyles = { ...baseStyles };
    
    // Replace color variables in styles
    Object.entries(themedStyles).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('var(--color-')) {
        const colorName = value.match(/var\(--color-(\w+)\)/)?.[1];
        if (colorName && colors[colorName]) {
          themedStyles[key] = colors[colorName];
        }
      }
    });
    
    return themedStyles;
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Theme constants
    THEMES,
    
    // Actions
    setTheme,
    toggleTheme,
    setThemePreset,
    setCustomColors,
    resetTheme,
    
    // Getters
    getCurrentColors,
    isDark,
    isLight,
    getColor,
    getGradient,
    getContrastColor,
    getThemedStyles
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware component wrapper
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export { THEMES, THEME_PRESETS };
export default ThemeContext;