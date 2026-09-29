import { Provider, EventRequirement } from '../data/types';
import { FilterState } from '../store/useRequirementStore';

export function filterProviders(
  providers: Provider[],
  requirement: EventRequirement,
  filters: FilterState,
  searchQuery: string
): Provider[] {
  let list = providers.filter((p) => p.category === requirement.category);

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.menuCategories.some((m) => m.dishes.some((d) => d.name.toLowerCase().includes(q)))
    );
  }

  if (requirement.district) {
    list = list.filter((p) => p.district === requirement.district || p.distanceKm <= 60);
  }

  if (filters.distanceKm) {
    list = list.filter((p) => p.distanceKm <= filters.distanceKm!);
  }

  if (filters.priceMin) {
    list = list.filter((p) => p.startingPrice >= filters.priceMin!);
  }
  if (filters.priceMax) {
    list = list.filter((p) => p.startingPrice <= filters.priceMax!);
  }

  if (filters.minRating) {
    list = list.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.minCapacity && requirement.category === 'catering') {
    list = list.filter((p) => p.maxCapacity >= filters.minCapacity!);
  }

  if (requirement.guestCount && requirement.category === 'catering') {
    // Soft preference: don't hard-exclude, capacity warning shown on card/detail instead.
  }

  if (filters.vegOnly && requirement.category === 'catering') {
    list = list.filter((p) => p.veg === 'veg' || p.veg === 'both');
  }

  if (filters.availableOnly) {
    list = list.filter((p) => p.availability === 'available');
  }

  switch (filters.sortBy) {
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case 'price_low':
      list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case 'price_high':
      list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case 'distance':
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    default:
      // relevance: blend of rating and review count, nudged by same-district match
      list = [...list].sort((a, b) => {
        const scoreA = a.rating * Math.log10(a.reviewCount + 10) + (a.district === requirement.district ? 1 : 0);
        const scoreB = b.rating * Math.log10(b.reviewCount + 10) + (b.district === requirement.district ? 1 : 0);
        return scoreB - scoreA;
      });
  }

  return list;
}
