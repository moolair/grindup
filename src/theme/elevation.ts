/**
 * GrindUp Elevation System
 * Based on the design system specifications for shadows and depth
 */

import { Platform, ViewStyle } from 'react-native';
import { palette } from './colors';

// Shadow opacity values
const SHADOW_OPACITY = {
  light: 0.08,
  medium: 0.12,
  dark: 0.16,
};

// Shadow colors
const SHADOW_COLOR = palette.neutral.black;

/**
 * Elevation levels for iOS and Android
 */
type ElevationLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const elevationValues: Record<ElevationLevel, ViewStyle> = {
  // No elevation
  none: Platform.select({
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
    default: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
  }),

  // Extra small elevation - subtle highlights
  xs: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: SHADOW_OPACITY.light,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: SHADOW_OPACITY.light,
      shadowRadius: 2,
    },
  }),

  // Small elevation - cards, buttons
  sm: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: SHADOW_OPACITY.light,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: SHADOW_OPACITY.light,
      shadowRadius: 4,
    },
  }),

  // Medium elevation - active cards, menus
  md: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: SHADOW_OPACITY.medium,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: SHADOW_OPACITY.medium,
      shadowRadius: 6,
    },
  }),

  // Large elevation - floating action buttons, dropdown menus
  lg: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: SHADOW_OPACITY.medium,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: SHADOW_OPACITY.medium,
      shadowRadius: 10,
    },
  }),

  // Extra large elevation - dialogs, modals
  xl: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: SHADOW_OPACITY.dark,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: SHADOW_OPACITY.dark,
      shadowRadius: 16,
    },
  }),

  // Extra extra large elevation - full-screen modals, splash screens
  xxl: Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: SHADOW_OPACITY.dark,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
    },
    default: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: SHADOW_OPACITY.dark,
      shadowRadius: 24,
    },
  }),
};

// Each interface state can have a different elevation level
export interface ElevationState {
  rest: ElevationLevel;
  hover?: ElevationLevel;
  active?: ElevationLevel;
  disabled?: ElevationLevel;
}

interface ElementElevation {
  rest: ElevationLevel;
  hover?: ElevationLevel;
  active?: ElevationLevel;
  disabled?: ElevationLevel;
}

interface ElevationSystem {
  level: (level: ElevationLevel) => ViewStyle;
  card: ElementElevation;
  button: ElementElevation;
  fab: ElementElevation;
  menu: ElementElevation;
  dialog: ElementElevation;
  modal: ElementElevation;
  getElevationStyle: (
    elementType: 'card' | 'button' | 'fab' | 'menu' | 'dialog' | 'modal',
    state?: keyof ElevationState
  ) => ViewStyle;
}

// Element elevation definitions
export const elevation: ElevationSystem = {
  // Get the styles for a specific elevation level
  level: (level: ElevationLevel): ViewStyle => elevationValues[level],

  // Predefined elevation states for common UI elements
  card: {
    rest: 'sm',
    hover: 'md',
    active: 'md',
    disabled: 'xs',
  },

  button: {
    rest: 'sm',
    hover: 'md',
    active: 'xs',
    disabled: 'none',
  },

  fab: {
    rest: 'lg',
    hover: 'xl',
    active: 'md',
    disabled: 'sm',
  },

  menu: {
    rest: 'md',
    hover: 'md',
    active: 'md',
  },

  dialog: {
    rest: 'xl',
  },

  modal: {
    rest: 'xxl',
  },

  // Get the elevation style for a specific element and state
  getElevationStyle: (
    elementType: 'card' | 'button' | 'fab' | 'menu' | 'dialog' | 'modal',
    state: keyof ElevationState = 'rest'
  ): ViewStyle => {
    const elementElevation = elevation[elementType];
    const elevationLevel = elementElevation[state] || elementElevation.rest;
    return elevationValues[elevationLevel];
  },
}; 