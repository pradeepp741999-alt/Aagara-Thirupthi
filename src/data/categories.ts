import { ServiceCategory } from './types';
import { colors } from '../theme';

export const categories: ServiceCategory[] = [
  {
    id: 'catering',
    name: 'Catering',
    tagline: 'Menus, dishes & packages for any headcount',
    icon: 'restaurant',
    color: colors.primary,
  },
  {
    id: 'decoration',
    name: 'Decoration',
    tagline: 'Stage, entrance & venue styling',
    icon: 'flower',
    color: colors.secondary,
  },
  {
    id: 'audio',
    name: 'Audio & Sound',
    tagline: 'Speakers, mics & stage audio setup',
    icon: 'mic',
    color: colors.gold,
  },
  {
    id: 'makeup',
    name: 'Makeup',
    tagline: 'Bridal, party & groom styling',
    icon: 'color-palette',
    color: '#D946EF',
  },
];

// Shown as "coming soon" chips to communicate the platform will expand —
// matches the doc's "future service categories" (section 6.4) without
// promising functionality that isn't built yet.
export const futureCategories = [
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'videography', name: 'Videography', icon: 'videocam' },
  { id: 'lighting', name: 'Lighting', icon: 'bulb' },
  { id: 'planning', name: 'Event Planning', icon: 'calendar' },
  { id: 'transport', name: 'Transportation', icon: 'car' },
  { id: 'music', name: 'Music / DJ', icon: 'musical-notes' },
  { id: 'rentals', name: 'Rentals', icon: 'cube' },
];
