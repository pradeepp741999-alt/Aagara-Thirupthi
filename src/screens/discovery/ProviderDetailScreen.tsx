import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Button, RatingStars, Chip, AvailabilityBadge, VerifiedBadge, Avatar } from '../../components';
import { getProviderById } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { formatCurrency } from '../../utils/currency';
import { useRequirementStore } from '../../store/useRequirementStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderDetail'>;

const { width } = Dimensions.get('window');

type Tab = 'about' | 'menu' | 'work' | 'reviews';

export function ProviderDetailScreen({ navigation, route }: Props) {
  const provider = getProviderById(route.params.providerId);
  const requirement = useRequirementStore((s) => s.requirement);
  const [tab, setTab] = useState<Tab>('about');

  if (!provider) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Provider not found.</Text>
      </SafeAreaView>
    );
  }

  const hasMenu = provider.menuCategories.length > 0;
  const capacityWarning =
    requirement.guestCount > 0 && provider.maxCapacity > 0 && requirement.guestCount > provider.maxCapacity;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'about', label: 'About' },
    ...(hasMenu || provider.packages.length ? [{ id: 'menu' as Tab, label: hasMenu ? 'Menu & Pricing' : 'Packages' }] : []),
    { id: 'work', label: 'Previous Work' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View>
          <Image source={{ uri: provider.coverImage }} style={styles.hero} contentFit="cover" />
          <SafeAreaView style={styles.heroOverlay} edges={['top']}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[type.h1, { color: colors.ink, flexShrink: 1 }]} numberOfLines={2}>{provider.name}</Text>
              </View>
              <Text style={[type.body, { color: colors.muted, marginTop: 4 }]}>{provider.tagline}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            {provider.verified && <VerifiedBadge />}
            <AvailabilityBadge status={provider.availability} />
          </View>

          <View style={styles.statRow}>
            <RatingStars rating={provider.rating} showValue reviewCount={provider.reviewCount} size={15} />
            <View style={styles.dotSep} />
            <Ionicons name="location-outline" size={14} color={colors.muted} />
            <Text style={[type.caption, { color: colors.muted, marginLeft: 3 }]}>{provider.distanceKm} km · {provider.district}</Text>
          </View>

          <Text style={[type.caption, { color: colors.muted, marginTop: 6 }]}>
            Serves: {provider.areas.join(', ')}
          </Text>

          <View style={styles.quickInfoRow}>
            <QuickInfo icon="time-outline" label={provider.responseTime} />
            {provider.category === 'catering' && (
              <QuickInfo icon="people-outline" label={`${provider.minCapacity}–${provider.maxCapacity} guests`} />
            )}
            <QuickInfo icon="briefcase-outline" label={`${provider.yearsActive}+ years active`} />
          </View>

          {capacityWarning && (
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={16} color={colors.warning} />
              <Text style={[type.caption, { color: colors.warning, marginLeft: 6, flex: 1 }]}>
                Your event needs {requirement.guestCount} guests — above this provider's listed capacity of {provider.maxCapacity}. You can still enquire to confirm.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tabBar}>
          {tabs.map((t) => (
            <Pressable key={t.id} onPress={() => setTab(t.id)} style={styles.tabItem}>
              <Text style={[type.bodyMedium, { color: tab === t.id ? colors.primary : colors.muted }]}>{t.label}</Text>
              {tab === t.id && <View style={styles.tabIndicator} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {tab === 'about' && (
            <>
              <Text style={[type.h3, { color: colors.ink, marginBottom: 8 }]}>About</Text>
              <Text style={[type.body, { color: colors.body, lineHeight: 22 }]}>{provider.description}</Text>

              {provider.packages.length > 0 && (
                <>
                  <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xl, marginBottom: 8 }]}>Packages from</Text>
                  <Text style={[type.display, { color: colors.primaryDark, fontSize: 26 }]}>
                    {provider.pricingModel === 'custom' ? 'Custom Quote' : formatCurrency(provider.startingPrice)}
                    {provider.pricingModel === 'per_person' && <Text style={type.body}> / guest</Text>}
                  </Text>
                </>
              )}
            </>
          )}

          {tab === 'menu' && (
            <MenuTab provider={provider} onSelectServices={() => navigation.navigate('DishSelection', { providerId: provider.id })} />
          )}

          {tab === 'work' && (
            <>
              <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Previous Work</Text>
              {provider.portfolio.length === 0 ? (
                <Text style={[type.body, { color: colors.muted }]}>No portfolio images added yet.</Text>
              ) : (
                <FlatList
                  data={provider.portfolio}
                  keyExtractor={(u, i) => u + i}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.portfolioImg} contentFit="cover" transition={150} />
                  )}
                />
              )}
            </>
          )}

          {tab === 'reviews' && <ReviewsTab provider={provider} />}
        </View>
      </ScrollView>

      <View style={[styles.footer, shadow.lg]}>
        <View>
          <Text style={[type.caption, { color: colors.muted }]}>Starting from</Text>
          <Text style={[type.h2, { color: colors.ink }]}>
            {provider.pricingModel === 'custom' ? 'Custom Quote' : formatCurrency(provider.startingPrice)}
            {provider.pricingModel === 'per_person' && <Text style={type.caption}> /guest</Text>}
          </Text>
        </View>
        <Button
          label={hasMenu || provider.packages.length ? 'Select & Enquire' : 'Send Enquiry'}
          icon="paper-plane"
          onPress={() =>
            hasMenu || provider.packages.length
              ? navigation.navigate('DishSelection', { providerId: provider.id })
              : navigation.navigate('EnquiryForm', { providerId: provider.id })
          }
          style={{ flex: 1, marginLeft: spacing.lg }}
        />
      </View>
    </View>
  );
}

function QuickInfo({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.quickInfoItem}>
      <Ionicons name={icon} size={14} color={colors.secondary} />
      <Text style={[type.caption, { color: colors.body, marginLeft: 5, flexShrink: 1 }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function MenuTab({ provider, onSelectServices }: { provider: NonNullable<ReturnType<typeof getProviderById>>; onSelectServices: () => void }) {
  return (
    <>
      {provider.packages.length > 0 && (
        <>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Packages</Text>
          {provider.packages.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              <View style={{ flex: 1 }}>
                <Text style={[type.bodyMedium, { color: colors.ink }]}>{pkg.name}</Text>
                <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{pkg.includes.join(' · ')}</Text>
                {pkg.minGuests > 0 && <Text style={[type.tiny, { color: colors.muted, marginTop: 4 }]}>Min {pkg.minGuests} guests</Text>}
              </View>
              <Text style={[type.bodyMedium, { color: colors.primaryDark }]}>
                {pkg.pricePerPerson > 0 ? `${formatCurrency(pkg.pricePerPerson)}${provider.category === 'catering' ? '/guest' : ''}` : 'Quote'}
              </Text>
            </View>
          ))}
        </>
      )}

      {provider.menuCategories.length > 0 && (
        <>
          <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>Menu Preview</Text>
          {provider.menuCategories.slice(0, 3).map((section) => (
            <View key={section.name} style={{ marginBottom: spacing.md }}>
              <Text style={[type.bodyMedium, { color: colors.body, marginBottom: 6 }]}>{section.name}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {section.dishes.slice(0, 5).map((dish) => (
                  <Chip
                    key={dish.id}
                    label={dish.price > 0 ? `${dish.name} · ${formatCurrency(dish.price)}` : dish.name}
                    tone={dish.veg ? 'success' : 'danger'}
                    style={{ marginRight: 6, marginBottom: 6 }}
                  />
                ))}
              </View>
            </View>
          ))}
        </>
      )}

      <Button label="View Full Menu & Select" icon="restaurant" fullWidth onPress={onSelectServices} style={{ marginTop: spacing.md }} />
    </>
  );
}

function ReviewsTab({ provider }: { provider: NonNullable<ReturnType<typeof getProviderById>> }) {
  return (
    <>
      <View style={styles.ratingSummary}>
        <View>
          <Text style={[type.display, { color: colors.ink }]}>{provider.rating.toFixed(1)}</Text>
          <RatingStars rating={provider.rating} size={14} />
          <Text style={[type.caption, { color: colors.muted, marginTop: 4 }]}>{provider.reviewCount} reviews</Text>
        </View>
      </View>
      {provider.reviews.map((rev) => (
        <View key={rev.id} style={styles.reviewCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar name={rev.customerName} color={rev.avatarColor} size={36} />
            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{rev.customerName}</Text>
              <Text style={[type.tiny, { color: colors.muted }]}>{rev.eventType} · {rev.date}</Text>
            </View>
            <RatingStars rating={rev.rating} size={12} />
          </View>
          <Text style={[type.body, { color: colors.body, marginTop: 8, lineHeight: 20 }]}>{rev.comment}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  hero: { width, height: 240, backgroundColor: colors.divider },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: spacing.lg },
  backBtn: {
    width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.overlay,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.background, marginTop: -radius.xxl, borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md,
  },
  badgeRow: { flexDirection: 'row', marginTop: spacing.sm },
  statRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  dotSep: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.faint, marginHorizontal: 8 },
  quickInfoRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  quickInfoItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondaryLight,
    borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 8,
  },
  warningBox: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.warningSoft,
    borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  tabItem: { marginRight: spacing.xl, paddingVertical: spacing.md },
  tabIndicator: { height: 2, backgroundColor: colors.primary, marginTop: 6, borderRadius: 1 },
  tabContent: { padding: spacing.xl },
  packageCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.sm,
  },
  portfolioImg: { width: (width - spacing.xl * 2 - 10) / 2, height: 120, borderRadius: radius.md, marginBottom: 10, backgroundColor: colors.divider },
  ratingSummary: { alignItems: 'center', paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.divider, marginBottom: spacing.md },
  reviewCard: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
  },
});
