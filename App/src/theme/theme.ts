export const COLORS = {
  primary: '#6D28D9', // Deep Purple / Royal Violet
  primaryLight: '#8B5CF6',
  primaryDark: '#4C1D95',
  secondary: '#10B981', // Emerald green for prices / actions
  background: '#F9FAFB', // Light gray background
  surface: '#FFFFFF',
  text: '#1F2937', // Dark gray for primary text
  textMuted: '#6B7280', // Medium gray for descriptions
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  shadow: 'rgba(109, 40, 217, 0.1)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: COLORS.textMuted,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.surface,
  },
};
