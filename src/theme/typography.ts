/**
 * GrindUp Typography
 * Based on the design system specifications
 */

import { TextStyle } from 'react-native';

// Font family definitions
export const fontFamily = {
  primary: 'Poppins',
  secondary: 'Inter',
  mono: 'JetBrainsMono-Regular',
};

// Font weights
export const fontWeight = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

// Font sizes
export const fontSize = {
  xxxs: 10,
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  display: 48,
  giant: 64,
};

// Line heights
export const lineHeight = {
  tight: 1.2,    // Headings
  normal: 1.5,   // Body text
  loose: 1.8,    // Spacious body text
};

// Letter spacing
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
};

// Typographic styles
type TypographyStyles = {
  [key: string]: TextStyle;
};

export const typography: TypographyStyles = {
  // Headings
  displayLarge: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.giant,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.giant * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayMedium: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // Headers
  h1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.md * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Labels
  labelLarge: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  labelMedium: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  labelSmall: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xxs * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  
  // Buttons
  buttonLarge: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  buttonMedium: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xs * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  buttonSmall: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xxs * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  
  // Other
  caption: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xxs * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xxs * lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.tight,
  },
}; 