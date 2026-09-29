import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { ScreenHeader, Button, Chip } from '../../components';
import { getProviderById } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { useCartStore } from '../../store/useCartStore';
import { useRequirementStore } from '../../store/useRequirementStore';
import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'DishSelection'>;

type Mode = 'packages' | 'dishes';

export function DishSelectionScreen({ navigation, route }: Props) {
  const provider = getProviderById(route.params.providerId);
  const guestCount = useRequirementStore((s) => s.requirement.guestCount) || 100;
  const { items, toggleDish, selectPackage, isDishSelected, total, startCart, clearPackage } = useCartStore();
  const [mode, setMode] = useState<Mode>('packages');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  useEffect(() => {
    if (provider) startCart(provider.id);
    if (provider && provider.packages.length === 0) setMode('dishes');
  }, [provider?.id]);

  if (!provider) return null;

  const selectedPackageId = items.find((it) => it.packageId)?.packageId;
  const hasBoth = provider.packages.length > 0 && provider.menuCategories.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Select Services" subtitle={provider.name} onBack={() => navigation.goBack()} />

      {hasBoth && (
        <View style={styles.modeRow}>
          <Pressable style={[styles.modeBtn, mode === 'packages' && styles.modeBtnActive]} onPress={() => setMode('packages')}>
            <Text style={[type.bodyMedium, { color: mode === 'packages' ? colors.white : colors.ink }]}>Packages</Text>
          </Pressable>
          <Pressable style={[styles.modeBtn, mode === 'dishes' && styles.modeBtnActive]} onPress={() => setMode('dishes')}>
            <Text style={[type.bodyMedium, { color: mode === 'dishes' ? colors.white : colors.ink }]}>À La Carte Dishes</Text>
          </Pressable>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}>
        {mode === 'packages' ? (
          <>
            <Text style={[type.caption, { color: colors.muted, marginBottom: spacing.md }]}>
              Choose a package — priced {provider.category === 'catering' ? 'per guest' : 'per event'}.
            </Text>
            {provider.packages.map((pkg) => {
              const selected = selectedPackageId === pkg.id;
              const pkgTotal = provider.category === 'catering' ? pkg.pricePerPerson * guestCount : pkg.pricePerPerson;
              return (
                <Pressable
                  key={pkg.id}
                  style={[styles.pkgCard, shadow.sm, selected && styles.pkgCardSelected]}
                  onPress={() => selectPackage(pkg.id, pkg.name, pkg.pricePerPerson, guestCount)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[type.h3, { color: colors.ink }]}>{pkg.name}</Text>
                      {pkg.minGuests > 0 && <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>Minimum {pkg.minGuests} guests</Text>}
                    </View>
                    <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.faint} />
                  </View>
                  <View style={{ marginTop: spacing.sm }}>
                    {pkg.includes.map((inc) => (
                      <View key={inc} style={styles.includeRow}>
                        <Ionicons name="checkmark" size={14} color={colors.success} />
                        <Text style={[type.caption, { color: colors.body, marginLeft: 6 }]}>{inc}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[type.bodyMedium, { color: colors.primaryDark, marginTop: spacing.sm }]}>
                    {pkg.pricePerPerson > 0
                      ? `${formatCurrency(pkg.pricePerPerson)}${provider.category === 'catering' ? '/guest' : ''} · Est. ${formatCurrency(pkgTotal)}`
                      : 'Custom quote'}
                  </Text>
                </Pressable>
              );
            })}
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
              <Chip label="All" selected={vegFilter === 'all'} onPress={() => setVegFilter('all')} style={{ marginRight: 8 }} />
              <Chip label="Veg" icon="leaf" tone="success" selected={vegFilter === 'veg'} onPress={() => setVegFilter('veg')} style={{ marginRight: 8 }} />
              <Chip label="Non-Veg" tone="danger" selected={vegFilter === 'non_veg'} onPress={() => setVegFilter('non_veg')} />
            </View>
            {provider.menuCategories.map((section) => {
              const dishes = section.dishes.filter((d) => vegFilter === 'all' || (vegFilter === 'veg' ? d.veg : !d.veg));
              if (dishes.length === 0) return null;
              return (
                <View key={section.name} style={{ marginBottom: spacing.lg }}>
                  <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>{section.name}</Text>
                  {dishes.map((dish) => {
                    const selected = isDishSelected(dish.id);
                    return (
                      <Pressable
                        key={dish.id}
                        style={[styles.dishRow, selected && styles.dishRowSelected]}
                        onPress={() => toggleDish(dish.id, dish.name, dish.price)}
                      >
                        <View style={[styles.vegMark, { borderColor: dish.veg ? colors.success : colors.danger }]}>
                          <View style={[styles.vegDot, { backgroundColor: dish.veg ? colors.success : colors.danger }]} />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.sm }}>
                          <Text style={[type.bodyMedium, { color: colors.ink }]}>{dish.name}</Text>
                          {dish.popular && <Text style={[type.tiny, { color: colors.gold }]}>★ Popular choice</Text>}
                        </View>
                        <Text style={[type.bodyMedium, { color: colors.body, marginRight: spacing.md }]}>
                          {dish.price > 0 ? formatCurrency(dish.price) : 'Included'}
                        </Text>
                        <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={22} color={selected ? colors.primary : colors.faint} />
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, shadow.lg]}>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: colors.muted }]}>{items.length} item{items.length !== 1 ? 's' : ''} selected</Text>
          <Text style={[type.h2, { color: colors.ink }]}>{formatCurrency(total())}</Text>
        </View>
        <Button
          label="Continue"
          icon="arrow-forward"
          iconPosition="right"
          disabled={items.length === 0}
          onPress={() => navigation.navigate('EnquiryForm', { providerId: provider.id })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  modeBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.divider,
  },
  modeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pkgCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.divider,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  pkgCardSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  includeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  dishRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.sm,
  },
  dishRowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  vegMark: { width: 16, height: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    paddingBottom: spacing.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
  },
});
