import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type, shadow } from '../theme';
import { Provider } from '../data/types';
import { RatingStars } from './RatingStars';
import { AvailabilityBadge, VerifiedBadge } from './Badge';

interface Props {
  provider: Provider;
  onPress: () => void;
  horizontal?: boolean;
}

export function ProviderCard({ provider, onPress, horizontal }: Props) {
  const priceLabel =
    provider.pricingModel === 'per_person'
      ? `₹${provider.startingPrice}/guest`
      : provider.pricingModel === 'custom'
      ? 'Custom quote'
      : `From ₹${provider.startingPrice.toLocaleString('en-IN')}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow.sm,
        horizontal ? { width: 240 } : undefined,
        { opacity: pressed ? 0.93 : 1 },
      ]}
    >
      <View>
        <Image source={{ uri: provider.coverImage }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.imageOverlay} />
        <View style={styles.topRow}>
          {provider.verified && <VerifiedBadge />}
          <View style={{ flex: 1 }} />
          <AvailabilityBadge status={provider.availability} compact />
        </View>
        <View style={styles.distancePill}>
          <Ionicons name="location" size={11} color={colors.white} />
          <Text style={styles.distanceText}>{provider.distanceKm} km</Text>
        </View>
      </View>

      <View style={{ padding: spacing.md }}>
        <Text style={[type.h3, { color: colors.ink }]} numberOfLines={1}>{provider.name}</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]} numberOfLines={1}>{provider.tagline}</Text>

        <View style={styles.metaRow}>
          <RatingStars rating={provider.rating} showValue reviewCount={provider.reviewCount} size={13} />
        </View>

        <View style={styles.footerRow}>
          <Text style={[type.bodyMedium, { color: colors.primaryDark }]}>{priceLabel}</Text>
          {provider.category === 'catering' && (
            <View style={[styles.vegDot, { backgroundColor: provider.veg === 'veg' ? colors.success : provider.veg === 'non_veg' ? colors.danger : colors.gold }]} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  image: { width: '100%', height: 130, backgroundColor: colors.divider },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: colors.overlay,
    opacity: 0.15,
  },
  topRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  distancePill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  distanceText: { color: colors.white, fontSize: 11, marginLeft: 3, fontWeight: '600' },
  metaRow: { marginTop: 6 },
  footerRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vegDot: { width: 10, height: 10, borderRadius: 5 },
});
