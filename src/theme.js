/**
 * src/theme.js
 * Design system tokens for Zestly (Little Lemon food ordering app).
 */

export const colors = {
  // Brand colors
  primaryGreen: '#495E57',
  primaryYellow: '#F4CE14',
  secondarySalmon: '#EE9972',
  lightGrey: '#EDEFEE',
  black: '#333333',
  white: '#FFFFFF',

  // Semantic & UI colors
  background: '#FFFFFF',
  cardBackground: '#EDEFEE',
  inputBackground: '#FFFFFF',
  inputBorder: '#CBD5E1',
  inputFocusBorder: '#495E57',
  error: '#DC2626',
  errorBackground: '#FEE2E2',
  textPrimary: '#333333',
  textSecondary: '#495E57',
  textMuted: '#6B7280',
  disabledBackground: '#CBD5E1',
  disabledText: '#94A3B8',
  divider: '#E2E8F0',
};

export const fonts = {
  // Markazi Text (Titles, restaurant hero brand)
  markaziRegular: 'MarkaziText_400Regular',
  markaziMedium: 'MarkaziText_500Medium',
  markaziSemiBold: 'MarkaziText_600SemiBold',
  markaziBold: 'MarkaziText_700Bold',

  // Karla (Body, inputs, labels, buttons)
  karlaRegular: 'Karla_400Regular',
  karlaMedium: 'Karla_500Medium',
  karlaSemiBold: 'Karla_600SemiBold',
  karlaBold: 'Karla_700Bold',
  karlaExtraBold: 'Karla_800ExtraBold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
};

export default {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
};
