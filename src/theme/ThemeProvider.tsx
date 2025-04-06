import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme, ThemeType } from './themes';

// Create the theme context
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (themeType: ThemeType) => void;
  toggleTheme: () => void;
}>({
  theme: lightTheme,
  setTheme: () => { },
  toggleTheme: () => { },
});

// ThemeProvider Props
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}

// Storage key for persisting theme preference
const THEME_STORAGE_KEY = 'GRIND_UP_THEME_PREFERENCE';

/**
 * ThemeProvider Component
 * Provides theme context to the entire application
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();

  // Initialize theme state
  const [themeType, setThemeType] = useState<ThemeType>(
    initialTheme || deviceColorScheme as ThemeType || 'light'
  );

  // Get the actual theme object based on current theme type
  const theme = themeType === 'dark' ? darkTheme : lightTheme;

  // Set theme function
  const setTheme = useCallback((newThemeType: ThemeType) => {
    setThemeType(newThemeType);
    // Save to AsyncStorage
    AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeType);
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newThemeType = themeType === 'light' ? 'dark' : 'light';
    setTheme(newThemeType);
  }, [themeType, setTheme]);

  // Effect to load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeType = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeType && (savedThemeType === 'light' || savedThemeType === 'dark')) {
          setThemeType(savedThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };
    loadTheme();
  }, []);

  // Effect to update theme when device theme changes
  useEffect(() => {
    if (deviceColorScheme && !initialTheme) {
      setThemeType(deviceColorScheme as ThemeType);
    }
  }, [deviceColorScheme, initialTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme in components
 * Returns the current theme and functions to change it
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeProvider; 