// Shared photography for the auth flow (Onboarding, Login, OTP, Profile Setup) —
// a single consistent image gives the arrival journey a coherent identity.
const AUTH_PHOTO_ID = 'photo-1587271636175-90d58cdad458';

export function authPhoto(width: number, height: number) {
  return `https://images.unsplash.com/${AUTH_PHOTO_ID}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}
