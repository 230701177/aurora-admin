import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme state - only dark theme supported
  const [theme] = useState('dark');

  // UI Preferences
  const [preferences, setPreferences] = useState({
    density: 'comfortable', // compact, comfortable, spacious
    fontSize: 'normal',     // small, normal, large
    sidebarCollapsed: false,
    animations: true,
    reduceMotion: false
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('aurora_ui_preferences');
    const savedSidebarState = localStorage.getItem('aurora_sidebar_collapsed');

    if (savedPreferences) {
      try {
        setPreferences(prev => ({
          ...prev,
          ...JSON.parse(savedPreferences)
        }));
      } catch (error) {
        console.error('Failed to load UI preferences:', error);
      }
    }

    if (savedSidebarState !== null) {
      setPreferences(prev => ({
        ...prev,
        sidebarCollapsed: savedSidebarState === 'true'
      }));
    }

    // Check user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({
      ...prev,
      reduceMotion: mediaQuery.matches
    }));

    // Listen for changes to motion preference
    const handleMotionChange = (e) => {
      setPreferences(prev => ({
        ...prev,
        reduceMotion: e.matches
      }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aurora_ui_preferences', JSON.stringify(preferences));
    localStorage.setItem('aurora_sidebar_collapsed', preferences.sidebarCollapsed);
  }, [preferences]);

  // Theme colors - only dark theme
  const themeColors = {
    dark: {
      background: {
        primary: '#0f1117',
        secondary: '#161a23',
        tertiary: '#1c2130',
        quaternary: '#242a3d'
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
        tertiary: '#64748b',
        muted: '#475569'
      },
      border: {
        primary: 'rgba(255, 255, 255, 0.1)',
        secondary: 'rgba(255, 255, 255, 0.07)',
        tertiary: 'rgba(255, 255, 255, 0.05)'
      },
      accent: {
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444'
      }
    }
  };

  // Current theme colors
  const colors = themeColors[theme] || themeColors.dark;

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setPreferences(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  // Set sidebar state explicitly
  const setSidebarCollapsed = (collapsed) => {
    setPreferences(prev => ({
      ...prev,
      sidebarCollapsed: collapsed
    }));
  };

  // Update UI density
  const setDensity = (density) => {
    if (['compact', 'comfortable', 'spacious'].includes(density)) {
      setPreferences(prev => ({
        ...prev,
        density
      }));
    }
  };

  // Update font size
  const setFontSize = (size) => {
    if (['small', 'normal', 'large'].includes(size)) {
      setPreferences(prev => ({
        ...prev,
        fontSize: size
      }));
    }
  };

  // Toggle animations
  const toggleAnimations = () => {
    setPreferences(prev => ({
      ...prev,
      animations: !prev.animations
    }));
  };

  // CSS variables for theme
  const cssVariables = useMemo(() => ({
    '--color-background-primary': colors.background.primary,
    '--color-background-secondary': colors.background.secondary,
    '--color-background-tertiary': colors.background.tertiary,
    '--color-background-quaternary': colors.background.quaternary,

    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--color-text-tertiary': colors.text.tertiary,
    '--color-text-muted': colors.text.muted,

    '--color-border-primary': colors.border.primary,
    '--color-border-secondary': colors.border.secondary,
    '--color-border-tertiary': colors.border.tertiary,

    '--color-primary': colors.accent.primary,
    '--color-success': colors.accent.success,
    '--color-warning': colors.accent.warning,
    '--color-danger': colors.accent.danger,

    // Spacing based on density
    '--spacing-unit': preferences.density === 'compact' ? '0.25rem' :
      preferences.density === 'spacious' ? '0.375rem' : '0.3125rem',

    // Font size scaling
    '--font-scale': preferences.fontSize === 'small' ? '0.875' :
      preferences.fontSize === 'large' ? '1.125' : '1',

    // Animation control
    '--animation-duration': preferences.animations && !preferences.reduceMotion ? '0.2s' : '0s',
    '--transition-duration': preferences.animations && !preferences.reduceMotion ? '0.3s' : '0s'
  }), [colors, preferences.density, preferences.fontSize, preferences.animations, preferences.reduceMotion]);

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply all CSS variables
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Add/remove reduced motion class
    if (preferences.reduceMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Add theme class for CSS selectors
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-density', preferences.density);
    root.setAttribute('data-font-size', preferences.fontSize);

  }, [theme, preferences, cssVariables]);

  const value = {
    theme,
    colors,
    preferences,
    toggleSidebar,
    setSidebarCollapsed,
    setDensity,
    setFontSize,
    toggleAnimations,
    cssVariables
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Helper hook for responsive design
export const useUI = () => {
  const { preferences } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile,
    isSidebarCollapsed: preferences.sidebarCollapsed,
    density: preferences.density,
    fontSize: preferences.fontSize,
    animationsEnabled: preferences.animations && !preferences.reduceMotion
  };
};

// Higher Order Component for theme-aware components
export const withTheme = (Component) => {
  return function WithThemeComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;
