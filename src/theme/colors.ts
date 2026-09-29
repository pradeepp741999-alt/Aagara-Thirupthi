// Aagara Thirupthi — color system
// Premium neutral foundation (white / soft off-white) so provider photos and
// videos stay the visual focus, with a Deep Royal Purple brand accent carrying
// navigation, primary actions and key highlights. Paired with a refined gold
// for ratings/premium cues and a jewel-tone teal for trust & verification.

export const colors = {
  // Brand
  primary: '#5B2C6F',
  primaryDark: '#3D1A4D',
  primaryLight: '#E8D9F0',
  primarySoft: '#F5EEF9',

  secondary: '#0C6E67',
  secondaryDark: '#084F4A',
  secondaryLight: '#DCF1EE',

  gold: '#C9971F',
  goldSoft: '#FBF1DC',

  // Neutrals (cool, purple-tinted — not warm brown)
  ink: '#1B1225',
  body: '#463C54',
  muted: '#867C93',
  faint: '#C6BFD1',
  border: '#E4DEEC',
  divider: '#ECE7F3',

  // Surfaces — a deliberate depth system: background (page) < surface (elevated cards)
  background: '#E9DFF1',
  surface: '#FFFFFF',
  surfaceAlt: '#EDEAF3',
  overlay: 'rgba(27, 18, 37, 0.6)',

  // Status
  success: '#1A9E63',
  successSoft: '#E1F7EC',
  warning: '#C98A00',
  warningSoft: '#FDF1D9',
  danger: '#DC3958',
  dangerSoft: '#FCE7EB',
  info: '#3763E0',
  infoSoft: '#EAEFFD',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type AppColors = typeof colors;
