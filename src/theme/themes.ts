/**
 * GrindUp Theme System
 * Combines all design system elements into coherent themes
 */

import { palette, darkPalette } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, insets, gaps } from './spacing';
import { elevation } from './elevation';

export type ThemeType = 'light' | 'dark';

export interface Theme {
  type: ThemeType;
  colors: {
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    // Surface colors (cards, modals, etc.)
    surface: {
      primary: string;
      secondary: string;
      elevated: string;
    };
    // Content colors (text, icons, etc.)
    content: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
    };
    // UI element colors
    ui: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
      disabled: string;
    };
    // Border colors
    border: {
      light: string;
      medium: string;
      dark: string;
    };
    // Contribution graph colors
    contributions: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
    };
  };
  // Re-export typography
  typography: typeof typography;
  // Re-export spacing
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  insets: typeof insets;
  gaps: typeof gaps;
  // Re-export elevation
  elevation: typeof elevation;
}

// Light theme (default)
export const lightTheme: Theme = {
  type: 'light',
  colors: {
    background: {
      primary: palette.neutral.white,
      secondary: palette.neutral.lightGray,
      tertiary: palette.primary[100],
    },
    surface: {
      primary: palette.neutral.white,
      secondary: palette.neutral.lightGray,
      elevated: palette.neutral.white,
    },
    content: {
      primary: palette.neutral.black,
      secondary: palette.neutral.darkGray,
      tertiary: palette.neutral.midGray,
      disabled: palette.neutral.midGray,
      inverse: palette.neutral.white,
    },
    ui: {
      primary: palette.primary[600],
      secondary: palette.secondary[600],
      accent: palette.accent[600],
      success: palette.success.base,
      warning: palette.warning.base,
      error: palette.error.base,
      disabled: palette.neutral.midGray,
    },
    border: {
      light: palette.neutral.lightGray,
      medium: palette.neutral.midGray,
      dark: palette.neutral.darkGray,
    },
    contributions: {
      level0: palette.contributionLevels.level0,
      level1: palette.contributionLevels.level1,
      level2: palette.contributionLevels.level2,
      level3: palette.contributionLevels.level3,
      level4: palette.contributionLevels.level4,
    },
  },
  typography,
  spacing,
  borderRadius,
  insets,
  gaps,
  elevation,
};

// Dark theme
export const darkTheme: Theme = {
  type: 'dark',
  colors: {
    background: {
      primary: '#121212', // Dark background
      secondary: '#1E1E1E', // Slightly lighter dark background
      tertiary: '#252525',
    },
    surface: {
      primary: '#1E1E1E',
      secondary: '#252525',
      elevated: '#2C2C2C',
    },
    content: {
      primary: darkPalette.neutral.black, // White
      secondary: darkPalette.neutral.darkGray, // Light gray
      tertiary: darkPalette.neutral.midGray, // Mid gray
      disabled: '#5C5C5C', // Darker gray
      inverse: darkPalette.neutral.white, // Dark background
    },
    ui: {
      primary: darkPalette.primary[600], // Lighter blue in dark mode
      secondary: darkPalette.secondary[600], // Lighter purple in dark mode
      accent: darkPalette.accent[600], // Lighter teal in dark mode
      success: darkPalette.success.base,
      warning: darkPalette.warning.base,
      error: darkPalette.error.base,
      disabled: '#5C5C5C',
    },
    border: {
      light: '#2C2C2C', // Dark gray
      medium: '#3D3D3D', // Medium gray
      dark: '#5C5C5C', // Light gray
    },
    contributions: {
      level0: darkPalette.contributionLevels.level0,
      level1: darkPalette.contributionLevels.level1,
      level2: darkPalette.contributionLevels.level2,
      level3: darkPalette.contributionLevels.level3,
      level4: darkPalette.contributionLevels.level4,
    },
  },
  typography,
  spacing,
  borderRadius,
  insets,
  gaps,
  elevation,
};

// Default theme to export
export const defaultTheme = lightTheme;

// Theme context and provider to be implemented
// This is a placeholder for the eventual theme context
export type ThemeContextType = {
  theme: Theme;
  setTheme: (type: ThemeType) => void;
  toggleTheme: () => void;
}; 