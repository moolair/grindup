/**
 * GrindUp Theme System
 * Combines all design system elements into coherent themes
 */

import { COLORS } from '../constants/colors';
import { typography } from './typography';
import { spacing, borderRadius, insets, gaps } from './spacing';
import { elevation } from './elevation';
import { palette, darkPalette } from './colors';

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
      primary: COLORS.NEUTRAL.WHITE,
      secondary: COLORS.NEUTRAL.LIGHT_GRAY,
      tertiary: COLORS.PRIMARY[100],
    },
    surface: {
      primary: COLORS.NEUTRAL.WHITE,
      secondary: COLORS.NEUTRAL.LIGHT_GRAY,
      elevated: COLORS.NEUTRAL.WHITE,
    },
    content: {
      primary: COLORS.NEUTRAL.BLACK,
      secondary: COLORS.NEUTRAL.DARK_GRAY,
      tertiary: COLORS.NEUTRAL.MID_GRAY,
      disabled: COLORS.NEUTRAL.MID_GRAY,
      inverse: COLORS.NEUTRAL.WHITE,
    },
    ui: {
      primary: COLORS.PRIMARY[600],
      secondary: COLORS.SECONDARY[600],
      accent: COLORS.ACCENT[600],
      success: COLORS.SUCCESS.BASE,
      warning: COLORS.WARNING.BASE,
      error: COLORS.ERROR.BASE,
      disabled: COLORS.NEUTRAL.MID_GRAY,
    },
    border: {
      light: COLORS.NEUTRAL.LIGHT_GRAY,
      medium: COLORS.NEUTRAL.MID_GRAY,
      dark: COLORS.NEUTRAL.DARK_GRAY,
    },
    contributions: {
      level0: COLORS.CONTRIBUTION.LEVEL_0,
      level1: COLORS.CONTRIBUTION.LEVEL_1,
      level2: COLORS.CONTRIBUTION.LEVEL_2,
      level3: COLORS.CONTRIBUTION.LEVEL_3,
      level4: COLORS.CONTRIBUTION.LEVEL_4,
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
      primary: COLORS.NEUTRAL.WHITE,
      secondary: COLORS.NEUTRAL.LIGHT_GRAY,
      tertiary: COLORS.NEUTRAL.MID_GRAY,
      disabled: '#5C5C5C', // Darker gray
      inverse: COLORS.NEUTRAL.BLACK,
    },
    ui: {
      primary: COLORS.PRIMARY[600],
      secondary: COLORS.SECONDARY[600],
      accent: COLORS.ACCENT[600],
      success: COLORS.SUCCESS.BASE,
      warning: COLORS.WARNING.BASE,
      error: COLORS.ERROR.BASE,
      disabled: '#5C5C5C',
    },
    border: {
      light: '#2C2C2C', // Dark gray
      medium: '#3D3D3D', // Medium gray
      dark: '#5C5C5C', // Light gray
    },
    contributions: {
      level0: COLORS.CONTRIBUTION.LEVEL_0,
      level1: COLORS.CONTRIBUTION.LEVEL_1,
      level2: COLORS.CONTRIBUTION.LEVEL_2,
      level3: COLORS.CONTRIBUTION.LEVEL_3,
      level4: COLORS.CONTRIBUTION.LEVEL_4,
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