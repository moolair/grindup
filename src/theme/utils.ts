/**
 * Theme Utilities
 * Helper functions for working with themes and styles
 */

import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { Theme } from './themes';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Create styles that depend on the theme
 * Similar to StyleSheet.create but with theme awareness
 */
export function createThemedStyles<T extends NamedStyles<T>>(
  styleFactory: (theme: Theme) => T
): (theme: Theme) => T {
  return (theme: Theme) => {
    const styles = styleFactory(theme);
    return StyleSheet.create(styles) as T;
  };
}

/**
 * Get a color with opacity
 * @param color The base color in hex format
 * @param opacity The opacity value (0-1)
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  // Make sure opacity is between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity));
  
  // If color is in #RRGGBB format
  if (color.startsWith('#') && (color.length === 7 || color.length === 9)) {
    const hexOpacity = Math.round(validOpacity * 255)
      .toString(16)
      .padStart(2, '0');
    
    // If already has alpha channel (#RRGGBBAA)
    if (color.length === 9) {
      return `${color.substring(0, 7)}${hexOpacity}`;
    }
    
    // Regular hex color (#RRGGBB)
    return `${color}${hexOpacity}`;
  }
  
  // If color is in rgb format
  if (color.startsWith('rgb(')) {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length === 3) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${validOpacity})`;
    }
  }
  
  // If color is already in rgba format
  if (color.startsWith('rgba(')) {
    const rgba = color.match(/\d+/g);
    if (rgba && rgba.length === 4) {
      return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${validOpacity})`;
    }
  }
  
  // Default fallback
  return color;
}

/**
 * Blend two colors together based on a mix ratio
 * @param color1 The first color
 * @param color2 The second color
 * @param ratio The mix ratio (0 = all color1, 1 = all color2)
 */
export function blendColors(
  color1: string, 
  color2: string, 
  ratio: number = 0.5
): string {
  // Ensure ratio is between 0 and 1
  const mixRatio = Math.max(0, Math.min(1, ratio));
  
  // Convert hex to RGB
  const parseColor = (color: string): number[] => {
    // For #RRGGBB
    if (color.startsWith('#') && color.length === 7) {
      return [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
      ];
    }
    // For rgb(r,g,b) or rgba(r,g,b,a)
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        return values.slice(0, 3).map(v => parseInt(v));
      }
    }
    return [0, 0, 0]; // Default to black if parsing fails
  };
  
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  // Blend the colors
  const r = Math.round(rgb1[0] * (1 - mixRatio) + rgb2[0] * mixRatio);
  const g = Math.round(rgb1[1] * (1 - mixRatio) + rgb2[1] * mixRatio);
  const b = Math.round(rgb1[2] * (1 - mixRatio) + rgb2[2] * mixRatio);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Determine if a color is light or dark
 * Useful for determining text color on a background
 * @param color The color to check
 */
export function isLightColor(color: string): boolean {
  const rgb = parseColor(color);
  // Calculate luminance using perceived brightness formula
  // See: https://www.w3.org/TR/AERT/#color-contrast
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.5;
}

/**
 * Helper to parse a color string into RGB values
 */
function parseColor(color: string): number[] {
  // For #RRGGBB
  if (color.startsWith('#') && color.length === 7) {
    return [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
    ];
  }
  // For #RRGGBBAA
  if (color.startsWith('#') && color.length === 9) {
    return [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
    ];
  }
  // For rgb(r,g,b) or rgba(r,g,b,a)
  if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      return values.slice(0, 3).map(v => parseInt(v));
    }
  }
  // Default
  return [0, 0, 0];
}

/**
 * Get contrasting text color (black or white) based on background
 * @param backgroundColor The background color
 */
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * Convert a HEX color to RGB
 * @param hex The hex color string
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Convert RGB to HEX color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 