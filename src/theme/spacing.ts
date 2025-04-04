/**
 * GrindUp Spacing System
 * Based on the design system specifications
 */

// Base unit for scaling
const BASE = 4;

// Spacing scale
export const spacing = {
  // Core spacing values
  none: 0,
  xxxs: BASE * 0.5, // 2
  xxs: BASE,        // 4
  xs: BASE * 2,     // 8
  sm: BASE * 3,     // 12
  md: BASE * 4,     // 16
  lg: BASE * 6,     // 24
  xl: BASE * 8,     // 32
  xxl: BASE * 12,   // 48
  xxxl: BASE * 16,  // 64
  
  // Special case spacings
  section: BASE * 20, // 80
  page: BASE * 24,    // 96
};

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
  circular: '50%',
};

// Insets (padding)
export const insets = {
  // Box insets (uniform padding)
  box: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  
  // Control insets (padding for interactive elements)
  control: {
    // Default control padding
    xs: { 
      vertical: spacing.xxs,
      horizontal: spacing.xs,
    },
    sm: {
      vertical: spacing.xs,
      horizontal: spacing.sm,
    },
    md: {
      vertical: spacing.sm,
      horizontal: spacing.md,
    },
    lg: {
      vertical: spacing.md,
      horizontal: spacing.lg,
    },
  },
  
  // Card insets
  card: {
    compact: spacing.md,
    default: spacing.lg,
    relaxed: spacing.xl,
  },
  
  // Screen insets
  screen: {
    horizontal: spacing.lg,
    vertical: spacing.lg,
    top: spacing.xl,
    bottom: spacing.xl,
  },
};

// Gaps (spacing between elements)
export const gaps = {
  // Stack gaps (vertical spacing)
  stack: {
    xxs: spacing.xxs,
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  
  // Inline gaps (horizontal spacing)
  inline: {
    xxs: spacing.xxs,
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  },
  
  // Grid gaps
  grid: {
    compact: spacing.xs,
    default: spacing.sm,
    relaxed: spacing.md,
  },
};

// Utility function to create consistent spacing arrays for different screen sizes
export const responsiveSpacing = {
  // Horizontal margins or paddings
  horizontal: (size: keyof typeof spacing) => ({
    marginHorizontal: spacing[size],
  }),
  
  // Vertical margins or paddings
  vertical: (size: keyof typeof spacing) => ({
    marginVertical: spacing[size],
  }),
  
  // Padding for all sides
  padding: (size: keyof typeof spacing) => ({
    padding: spacing[size],
  }),
  
  // Margin for all sides
  margin: (size: keyof typeof spacing) => ({
    margin: spacing[size],
  }),
}; 