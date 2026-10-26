import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, Chip, Button, Stepper, Input, MonthCalendar } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useRequirementStore } from '../../store/useRequirementStore';
import { eventTypes } from '../../data/seed';
import { districts } from '../../data/districts';
import { categories } from '../../data/categories';

type Props = NativeStackScreenProps<RootStackParamList, 'RequirementForm'>;

const makeupEventTypes = [
  'Bridal (Muhurtham)',
  'Reception',
  'Engagement',
  'Sangeet / Mehendi',
  'Pre-Wedding Shoot',
  'Family Function',
];

const makeupServicesList = [
  'HD Bridal Makeup',
  'Airbrush Makeover',
  'Saree Draping',
  'Bridal Hairstyling',
  'Family / Guest Styling',
  'Groom Styling',
];

export function RequirementFormScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const catMeta = categories.find((c) => c.id === category) || categories[0];
  const requirement = useRequirementStore((s) => s.requirement);
  const updateRequirement = useRequirementStore((s) => s.updateRequirement);

  const isMakeup = category === 'makeup';

  const [eventType, setEventType] = useState(
    isMakeup ? 'Bridal (Muhurtham)' : requirement.eventType || eventTypes[0]
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    isMakeup ? ['HD Bridal Makeup', 'Saree Draping'] : []
  );
  const [selectedDate, setSelectedDate] = useState<string>(requirement.eventDate || '');
  const [selectedEndDate, setSelectedEndDate] = useState<string>(requirement.eventEndDate || requirement.eventDate || '');
  const [isMultiDay, setIsMultiDay] = useState<boolean>(isMakeup);
  const [district, setDistrict] = useState(requirement.district);
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(isMakeup ? (requirement.makeupPersonsCount || 2) : 100);
  const [simultaneousStyling, setSimultaneousStyling] = useState<boolean>(
    requirement.simultaneousStyling !== undefined ? requirement.simultaneousStyling : true
  );
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [notes, setNotes] = useState('');

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleContinue = () => {
    const makeupStaffingNote = isMakeup && guestCount >= 2
      ? (simultaneousStyling
          ? `[Simultaneous Styling Required: ${guestCount} persons at the same time. 1 Lead Artist + 1 Backup/Assistant Artist required]`
          : `[Sequential Styling: ${guestCount} persons one after another by 1 artist]`)
      : '';

    const dateRangeNote = isMakeup && isMultiDay && selectedEndDate && selectedEndDate !== selectedDate
      ? `[Dates: ${selectedDate} to ${selectedEndDate}]`
      : '';

    const combinedNotes = [
      isMakeup && selectedServices.length > 0 ? `Services requested: ${selectedServices.join(', ')}` : '',
      dateRangeNote,
      makeupStaffingNote,
      notes,
    ].filter(Boolean).join('. ');

    updateRequirement({
      category,
      eventType,
      eventDate: selectedDate,
      eventEndDate: isMultiDay ? (selectedEndDate || selectedDate) : selectedDate,
      makeupPersonsCount: isMakeup ? guestCount : undefined,
      simultaneousStyling: isMakeup && guestCount >= 2 ? simultaneousStyling : false,
      backupArtistNeeded: isMakeup && guestCount >= 2 && simultaneousStyling,
      district,
      location,
      guestCount,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      notes: combinedNotes,
    });
    navigation.navigate('SearchResults');
  };

  const availableEventTypes = isMakeup ? makeupEventTypes : eventTypes;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title={`${catMeta.name} Requirement`}
        subtitle={isMakeup ? 'Tell us about your styling & makeover needs' : 'Tell us about your event'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Event Type</Text>
        <View style={styles.chipWrap}>
          {availableEventTypes.map((et) => (
            <Chip
              key={et}
              label={et}
              selected={eventType === et}
              onPress={() => setEventType(et)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>

        {isMakeup && (
          <>
            <Text style={styles.label}>Services Needed</Text>
            <View style={styles.chipWrap}>
              {makeupServicesList.map((svc) => (
                <Chip
                  key={svc}
                  label={svc}
                  selected={selectedServices.includes(svc)}
                  onPress={() => toggleService(svc)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={styles.label}>
            {isMakeup ? 'Makeover Dates (From Date → To Date)' : 'Event Date (Month View)'}
          </Text>
          {isMakeup && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Pressable
                onPress={() => setIsMultiDay(false)}
                style={[styles.dateTypePill, !isMultiDay && styles.dateTypePillActive]}
              >
                <Text style={[styles.dateTypePillText, !isMultiDay && styles.dateTypePillTextActive]}>Single Day</Text>
              </Pressable>
              <Pressable
                onPress={() => setIsMultiDay(true)}
                style={[styles.dateTypePill, isMultiDay && styles.dateTypePillActive, { marginLeft: 6 }]}
              >
                <Text style={[styles.dateTypePillText, isMultiDay && styles.dateTypePillTextActive]}>From / To Range</Text>
              </Pressable>
            </View>
          )}
        </View>

        <MonthCalendar
          selectedDate={selectedDate}
          endDate={isMultiDay ? selectedEndDate : undefined}
          onSelectDate={setSelectedDate}
          onSelectEndDate={setSelectedEndDate}
          allowRange={isMakeup && isMultiDay}
        />

        <Text style={styles.label}>District</Text>
        <View style={styles.chipWrap}>
          {districts.map((dist) => (
            <Chip
              key={dist.id}
              label={dist.name}
              selected={district === dist.name}
              onPress={() => setDistrict(dist.name)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>

        <Input
          label={isMakeup ? 'Venue / Location for Makeover' : 'Event Location / Venue (optional)'}
          icon="location-outline"
          value={location}
          onChangeText={setLocation}
          placeholder={isMakeup ? 'e.g. Wedding Hall or Home, Fairlands' : 'e.g. Fairlands, near ring road'}
        />

        <Text style={styles.label}>
          {isMakeup ? 'How Many People Need Makeup / Makeover?' : 'Number of Guests'}
        </Text>

        {isMakeup && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
            {[1, 2, 3, 4, 5].map((count) => (
              <Chip
                key={count}
                label={count === 1 ? '1 Person' : `${count} Persons`}
                selected={guestCount === count}
                onPress={() => setGuestCount(count)}
                style={{ marginRight: 6, marginBottom: 6 }}
              />
            ))}
          </View>
        )}

        <View style={[styles.stepperCard]}>
          <Stepper
            value={guestCount}
            onChange={setGuestCount}
            step={1}
            min={1}
            max={isMakeup ? 30 : 5000}
            suffix={isMakeup ? 'person(s)' : 'guests'}
          />
        </View>

        {/* Makeup Same-Time (Simultaneous) Styling & Backup Artist Handler */}
        {isMakeup && guestCount >= 2 ? (
          <View style={styles.simultaneousCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={[type.h3, { color: colors.ink, marginLeft: 6 }]}>
                Do they need makeup at the SAME TIME?
              </Text>
            </View>
            <Text style={[type.caption, { color: colors.muted, marginBottom: spacing.md }]}>
              E.g. Bride + Bridesmaid/Mother need to be ready at the same hour
            </Text>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable
                onPress={() => setSimultaneousStyling(true)}
                style={[styles.optionCard, simultaneousStyling && styles.optionCardSelected]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[type.bodyMedium, { fontWeight: '700', color: simultaneousStyling ? colors.primaryDark : colors.ink }]}>
                    Yes, Same Time
                  </Text>
                  {simultaneousStyling && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                </View>
                <Text style={[type.tiny, { color: colors.muted, marginTop: 4, lineHeight: 16 }]}>
                  Both persons styled concurrently
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSimultaneousStyling(false)}
                style={[styles.optionCard, !simultaneousStyling && styles.optionCardSelected]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[type.bodyMedium, { fontWeight: '700', color: !simultaneousStyling ? colors.primaryDark : colors.ink }]}>
                    No, Staggered
                  </Text>
                  {!simultaneousStyling && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                </View>
                <Text style={[type.tiny, { color: colors.muted, marginTop: 4, lineHeight: 16 }]}>
                  One after another (~2 hrs each)
                </Text>
              </Pressable>
            </View>

            {simultaneousStyling ? (
              <View style={styles.backupNoticeBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.success} />
                  <Text style={[type.bodyMedium, { color: colors.success, fontWeight: '700', marginLeft: 6 }]}>
                    1 Lead Artist + 1 Backup/Assistant Artist Assigned
                  </Text>
                </View>
                <Text style={[type.caption, { color: colors.body, marginTop: 4, lineHeight: 18 }]}>
                  Because {guestCount} people need makeover at the same time, 1 Lead Artist + 1 Assistant / Backup Artist will be assigned so both individuals are styled simultaneously without delay.
                </Text>
              </View>
            ) : (
              <View style={styles.sequentialNoticeBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time-outline" size={18} color={colors.secondary} />
                  <Text style={[type.bodyMedium, { color: colors.secondary, fontWeight: '700', marginLeft: 6 }]}>
                    Single Lead Artist (Sequential Styling)
                  </Text>
                </View>
                <Text style={[type.caption, { color: colors.body, marginTop: 4, lineHeight: 18 }]}>
                  1 Lead Makeup Artist will style both persons one after another. Total styling time: ~{guestCount * 1.5} to {guestCount * 2} hours.
                </Text>
              </View>
            )}
          </View>
        ) : isMakeup && guestCount === 1 ? (
          <View style={styles.singlePersonNotice}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={[type.caption, { color: colors.primaryDark, marginLeft: 6, fontWeight: '600' }]}>
              1 Dedicated Lead Makeup Artist will be reserved for your session.
            </Text>
          </View>
        ) : null}

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
          label={isMakeup ? 'Styling Preferences / Notes (optional)' : 'Additional Requirements (optional)'}
          icon="document-text-outline"
          value={notes}
          onChangeText={setNotes}
          placeholder={
            isMakeup
              ? 'e.g. Need trial session, skin sensitivity notes, jewellery styling'
              : 'e.g. Need pure vegetarian menu only'
          }
          multiline
          numberOfLines={3}
          style={{ minHeight: 70, textAlignVertical: 'top' }}
          containerStyle={{ marginTop: spacing.md }}
        />

        <Button
          label="Search Providers"
          icon="search"
          fullWidth
          size="lg"
          onPress={handleContinue}
          style={{ marginTop: spacing.md }}
        />
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
  dateTypePill: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTypePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateTypePillText: {
    ...type.tiny,
    color: colors.muted,
    fontWeight: '600',
  },
  dateTypePillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  simultaneousCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    marginBottom: spacing.lg,
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  backupNoticeBox: {
    marginTop: spacing.md,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  sequentialNoticeBox: {
    marginTop: spacing.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  singlePersonNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
});
