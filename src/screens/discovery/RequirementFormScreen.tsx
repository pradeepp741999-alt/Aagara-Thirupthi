import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, Chip, Button, Stepper, Input } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useRequirementStore } from '../../store/useRequirementStore';
import { eventTypes } from '../../data/seed';
import { districts } from '../../data/districts';
import { nextDays, toISODate, weekdayLabel } from '../../utils/date';
import { categories } from '../../data/categories';

type Props = NativeStackScreenProps<RootStackParamList, 'RequirementForm'>;

const upcomingDays = nextDays(10, 3);

export function RequirementFormScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const catMeta = categories.find((c) => c.id === category)!;
  const requirement = useRequirementStore((s) => s.requirement);
  const updateRequirement = useRequirementStore((s) => s.updateRequirement);

  const [eventType, setEventType] = useState(requirement.eventType);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [district, setDistrict] = useState(requirement.district);
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(100);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [notes, setNotes] = useState('');

  const handleContinue = () => {
    updateRequirement({
      category,
      eventType,
      eventDate: selectedDate,
      district,
      location,
      guestCount,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      notes,
    });
    navigation.navigate('SearchResults');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={`${catMeta.name} Requirement`} subtitle="Tell us about your event" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Event Type</Text>
        <View style={styles.chipWrap}>
          {eventTypes.map((et) => (
            <Chip key={et} label={et} selected={eventType === et} onPress={() => setEventType(et)} style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        <Text style={styles.label}>Event Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          {upcomingDays.map((d) => {
            const iso = toISODate(d);
            const active = selectedDate === iso;
            return (
              <Pressable key={iso} style={[styles.dateCard, active && styles.dateCardActive]} onPress={() => setSelectedDate(iso)}>
                <Text style={[type.tiny, { color: active ? colors.white : colors.muted }]}>{weekdayLabel(d)}</Text>
                <Text style={[type.h3, { color: active ? colors.white : colors.ink, marginTop: 2 }]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>District</Text>
        <View style={styles.chipWrap}>
          {districts.map((dist) => (
            <Chip key={dist.id} label={dist.name} selected={district === dist.name} onPress={() => setDistrict(dist.name)} style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        <Input
          label="Event Location / Venue (optional)"
          icon="location-outline"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Fairlands, near ring road"
        />

        <Text style={styles.label}>Number of Guests</Text>
        <View style={[styles.stepperCard]}>
          <Stepper value={guestCount} onChange={setGuestCount} step={10} min={10} max={5000} suffix="guests" />
        </View>

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Budget Range (optional)</Text>
        <View style={styles.budgetRow}>
          <View style={styles.budgetInputWrap}>
            <Text style={[type.caption, { color: colors.muted, marginBottom: 4 }]}>Minimum</Text>
            <View style={styles.budgetBox}>
              <Text style={{ color: colors.muted, marginRight: 4 }}>₹</Text>
              <TextInput
                keyboardType="number-pad"
                value={budgetMin}
                onChangeText={setBudgetMin}
                placeholder="0"
                placeholderTextColor={colors.faint}
                style={[type.body, { color: colors.ink, flex: 1, outlineStyle: 'none' as any }]}
              />
            </View>
          </View>
          <View style={{ width: spacing.md }} />
          <View style={styles.budgetInputWrap}>
            <Text style={[type.caption, { color: colors.muted, marginBottom: 4 }]}>Maximum</Text>
            <View style={styles.budgetBox}>
              <Text style={{ color: colors.muted, marginRight: 4 }}>₹</Text>
              <TextInput
                keyboardType="number-pad"
                value={budgetMax}
                onChangeText={setBudgetMax}
                placeholder="No limit"
                placeholderTextColor={colors.faint}
                style={[type.body, { color: colors.ink, flex: 1, outlineStyle: 'none' as any }]}
              />
            </View>
          </View>
        </View>

        <Input
          label="Additional Requirements (optional)"
          icon="document-text-outline"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Need pure vegetarian menu only"
          multiline
          numberOfLines={3}
          style={{ minHeight: 70, textAlignVertical: 'top' }}
          containerStyle={{ marginTop: spacing.md }}
        />

        <Button label="Search Providers" icon="search" fullWidth size="lg" onPress={handleContinue} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.xl, paddingBottom: spacing.huge },
  label: { ...type.bodyMedium, color: colors.ink, marginBottom: spacing.sm },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  dateCard: {
    width: 54,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dateCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepperCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  budgetRow: { flexDirection: 'row', marginBottom: spacing.lg },
  budgetInputWrap: { flex: 1 },
  budgetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
});
