/**
 * GrindUp Color Palette
 * Based on the design system specifications
 */

export const palette = {
  // Primary colors
  primary: {
    900: '#0A236B',
    800: '#1A3A98',
    700: '#2952D9',
    600: '#3366FF', // Base primary color
    500: '#5C85FF',
    400: '#85A3FF',
    300: '#ADC2FF',
    200: '#D6E0FF',
    100: '#EBF0FF',
  },

  // Secondary colors
  secondary: {
    900: '#2E2566',
    800: '#3F3487',
    700: '#5445BE',
    600: '#6C5CE7', // Base secondary color
    500: '#877BEB',
    400: '#A39BF0',
    300: '#BEBAF4',
    200: '#DCDAF9',
    100: '#EEEDFC',
  },

  // Accent colors
  accent: {
    900: '#005644',
    800: '#00755D',
    700: '#00947A',
    600: '#00C9A7', // Base accent color
    500: '#1AD4B5',
    400: '#4DDFC7',
    300: '#7FE9D9',
    200: '#B2F2E8',
    100: '#E6FAF7',
  },

  // Success colors
  success: {
    dark: '#008F73',
    base: '#00B894',
    light: '#47D7B9',
    lightest: '#DFFAF3',
  },

  // Warning colors
  warning: {
    dark: '#E7AA36',
    base: '#FDCB6E',
    light: '#FEDA95',
    lightest: '#FFF7E6',
  },

  // Error colors
  error: {
    dark: '#D64545',
    base: '#FF6B6B',
    light: '#FF9C9C',
    lightest: '#FFEDED',
  },

  // Neutral colors
  neutral: {
    black: '#2C3E50',
    darkGray: '#8395A7',
    midGray: '#D1D8E0',
    lightGray: '#F5F6FA',
    white: '#FFFFFF',
  },

  // Contribution graph colors
  contributionLevels: {
    level0: '#EBF0FF', // No activity
    level1: '#ADC2FF', // Low activity (1-2)
    level2: '#5C85FF', // Medium activity (3-5)
    level3: '#2952D9', // High activity (6-9)
    level4: '#0A236B', // Very high activity (10+)
  },
};

// Dark mode palette
export const darkPalette = {
  // Primary colors in dark mode
  primary: {
    900: '#EBF0FF',
    800: '#D6E0FF',
    700: '#ADC2FF',
    600: '#85A3FF', // Base primary color in dark mode
    500: '#5C85FF',
    400: '#3366FF',
    300: '#2952D9',
    200: '#1A3A98',
    100: '#0A236B',
  },

  // Secondary colors in dark mode
  secondary: {
    900: '#EEEDFC',
    800: '#DCDAF9',
    700: '#BEBAF4',
    600: '#A39BF0', // Base secondary color in dark mode
    500: '#877BEB',
    400: '#6C5CE7',
    300: '#5445BE',
    200: '#3F3487',
    100: '#2E2566',
  },

  // Accent colors in dark mode
  accent: {
    900: '#E6FAF7',
    800: '#B2F2E8',
    700: '#7FE9D9',
    600: '#4DDFC7', // Base accent color in dark mode
    500: '#1AD4B5',
    400: '#00C9A7',
    300: '#00947A',
    200: '#00755D',
    100: '#005644',
  },

  // Success colors in dark mode
  success: {
    dark: '#DFFAF3',
    base: '#47D7B9',
    light: '#00B894',
    lightest: '#008F73',
  },

  // Warning colors in dark mode
  warning: {
    dark: '#FFF7E6',
    base: '#FEDA95',
    light: '#FDCB6E',
    lightest: '#E7AA36',
  },

  // Error colors in dark mode
  error: {
    dark: '#FFEDED',
    base: '#FF9C9C',
    light: '#FF6B6B',
    lightest: '#D64545',
  },

  // Neutral colors in dark mode
  neutral: {
    black: '#FFFFFF',
    darkGray: '#F5F6FA',
    midGray: '#D1D8E0',
    lightGray: '#8395A7',
    white: '#121212', // Dark background
  },

  // Contribution graph colors in dark mode
  contributionLevels: {
    level0: '#1E1E1E', // No activity
    level1: '#2952D9', // Low activity (1-2)
    level2: '#5C85FF', // Medium activity (3-5)
    level3: '#ADC2FF', // High activity (6-9)
    level4: '#EBF0FF', // Very high activity (10+)
  },
}; 