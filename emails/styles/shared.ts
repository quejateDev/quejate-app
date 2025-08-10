// Colores de la paleta de Quejate
export const colors = {
  background: '#E8E8E8',
  foreground: '#123159',
  primary: '#3E5C84',
  secondary: '#D8E6F8',
  tertiary: '#123159',
  quaternary: '#005DD6',
  muted: '#E8E8E8',
  accent: '#D8E6F8',
  destructive: '#FF4D4D',
  border: '#D8E6F8',
  white: '#FFFFFF',
  text: {
    primary: '#123159',
    secondary: '#3E5C84',
    muted: '#6B7280',
    light: '#9CA3AF'
  }
};

export const baseStyles = {
  main: {
    backgroundColor: colors.background,
    fontFamily: 'Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    margin: '40px 0 0',
    padding: '0',
  },
  container: {
    backgroundColor: colors.white,
    margin: '20px auto',
    padding: '0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '600px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.white,
    padding: '50px 40px 20px 40px',
    textAlign: 'center' as const,
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  content: {
    padding: '40px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.3',
    color: colors.text.primary,
    margin: '0 0 24px 0',
    textAlign: 'left' as const,
  },
  subheading: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '1.4',
    color: colors.text.secondary,
    margin: '0 0 16px 0',
  },
  paragraph: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    lineHeight: '1.6',
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.quaternary,
    borderRadius: '8px',
    color: colors.white,
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 28px',
    margin: '24px 0',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    color: colors.quaternary,
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 28px',
    margin: '24px 0',
    border: `2px solid ${colors.quaternary}`,
    cursor: 'pointer',
  },
  link: {
    color: colors.quaternary,
    textDecoration: 'underline',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: colors.muted,
    padding: '30px 40px',
    textAlign: 'center' as const
  },
  footerText: {
    fontSize: '14px',
    color: colors.text.muted,
    margin: '0 0 8px 0',
    lineHeight: '1.5',
  },
  footerLink: {
    color: colors.text.secondary,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    backgroundColor: colors.border,
    margin: '32px 0',
    border: 'none',
  },
  alert: {
    backgroundColor: colors.accent,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '16px',
    margin: '20px 0',
  },
  alertText: {
    color: colors.text.secondary,
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0',
  },
  brandColors: colors,
} as const;

export type BaseStyles = typeof baseStyles;