import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, Button, Input, Card, ProgressSteps, Chip, Stepper, MonthCalendar } from '../../components';
import { getProviderById } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { useCartStore } from '../../store/useCartStore';
import { useRequirementStore } from '../../store/useRequirementStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useProviderStore } from '../../store/useProviderStore';
import { formatCurrency } from '../../utils/currency';
import { formatLongDate } from '../../utils/date';
import { eventTypes } from '../../data/seed';

type Props = NativeStackScreenProps<RootStackParamList, 'EnquiryForm'>;

export function EnquiryFormScreen({ navigation, route }: Props) {
  const provider = getProviderById(route.params.providerId);
  const requirement = useRequirementStore((s) => s.requirement);
  const updateRequirement = useRequirementStore((s) => s.updateRequirement);
  const { items, total, clearCart } = useCartStore();
  const submitEnquiry = useEnquiryStore((s) => s.submitEnquiry);
  const profile = useAuthStore((s) => s.profile);

  const providerCalendar = useProviderStore((s) =>
    provider ? s.getCalendarForProvider(provider.id) : undefined
  );
  const availableDates = useProviderStore((s) =>
    provider ? s.getAvailableDatesForProvider(provider.id) : undefined
  );

  const [location, setLocation] = useState(requirement.location || `${profile.location ? profile.location + ', ' : ''}${profile.district}`);
  const [notes, setNotes] = useState(requirement.notes || '');
  const [editingDetails, setEditingDetails] = useState(!requirement.eventDate);
  const [eventType, setEventType] = useState(requirement.eventType);
  const [eventDate, setEventDate] = useState(requirement.eventDate);
  const isMakeup = provider?.category === 'makeup';
  const [eventEndDate, setEventEndDate] = useState(requirement.eventEndDate || requirement.eventDate);
  const [guestCount, setGuestCount] = useState(requirement.guestCount);
  const [simultaneousStyling, setSimultaneousStyling] = useState<boolean>(
    requirement.simultaneousStyling !== undefined ? requirement.simultaneousStyling : true
  );

  if (!provider) return null;

  const handleSubmit = async () => {
    updateRequirement({
      eventType,
      eventDate,
      eventEndDate: isMakeup ? eventEndDate : eventDate,
      guestCount,
      makeupPersonsCount: isMakeup ? guestCount : undefined,
      simultaneousStyling: isMakeup && guestCount >= 2 ? simultaneousStyling : false,
      backupArtistNeeded: isMakeup && guestCount >= 2 && simultaneousStyling,
      location,
      notes,
    });
    const enquiry = await submitEnquiry({
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      eventType,
      eventDate,
      eventEndDate: isMakeup ? eventEndDate : eventDate,
      location,
      guestCount,
      makeupPersonsCount: isMakeup ? guestCount : undefined,
      simultaneousStyling: isMakeup && guestCount >= 2 ? simultaneousStyling : false,
      backupArtistAssigned: isMakeup && guestCount >= 2 && simultaneousStyling,
      items: items.length > 0 ? items : [{ name: 'General enquiry', price: 0, qty: 1 }],
      notes,
    });
    clearCart();
    navigation.replace('EnquirySuccess', { enquiryId: enquiry.id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Submit Enquiry" subtitle={provider.name} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }} keyboardShouldPersistTaps="handled">
        <ProgressSteps steps={['Select', 'Details', 'Sent']} currentIndex={1} />

        <Card style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={[type.h3, { color: colors.ink }]}>Event Summary</Text>
            <Pressable onPress={() => setEditingDetails((v) => !v)} hitSlop={8}>
              <Text style={[type.bodyMedium, { color: colors.primary }]}>{editingDetails ? 'Done' : 'Edit'}</Text>
            </Pressable>
          </View>

          {editingDetails ? (
            <>
              <Text style={[type.caption, { color: colors.muted, marginBottom: 6 }]}>Event Type</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
                {eventTypes.map((et) => (
                  <Chip key={et} label={et} selected={eventType === et} onPress={() => setEventType(et)} style={{ marginRight: 6, marginBottom: 6 }} />
                ))}
              </View>

              <Text style={[type.caption, { color: colors.muted, marginBottom: 6 }]}>
                {isMakeup ? 'Makeover Dates (From Date → To Date)' : 'Event Date (Month View)'}
              </Text>
              <MonthCalendar
                selectedDate={eventDate}
                endDate={isMakeup ? eventEndDate : undefined}
                onSelectDate={setEventDate}
                onSelectEndDate={setEventEndDate}
                allowRange={isMakeup}
                statusMap={providerCalendar}
                availableDates={availableDates}
              />

              <Text style={[type.caption, { color: colors.muted, marginBottom: 6, marginTop: spacing.md }]}>
                {isMakeup ? 'Number of Persons Requiring Makeup' : 'Guest Count'}
              </Text>
              <Stepper
                value={guestCount}
                onChange={setGuestCount}
                step={isMakeup ? 1 : 10}
                min={1}
                max={isMakeup ? 30 : 5000}
                suffix={isMakeup ? 'person(s)' : 'guests'}
              />

              {isMakeup && guestCount >= 2 && (
                <View style={{ marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={[type.bodyMedium, { fontWeight: '700', color: colors.ink, marginBottom: 4 }]}>
                    Simultaneous Styling (Same Time)?
                  </Text>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.xs }}>
                    <Pressable
                      onPress={() => setSimultaneousStyling(true)}
                      style={{
                        flex: 1,
                        padding: spacing.sm,
                        borderRadius: radius.md,
                        backgroundColor: simultaneousStyling ? colors.primarySoft : colors.surface,
                        borderWidth: 1.5,
                        borderColor: simultaneousStyling ? colors.primary : colors.divider,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={[type.caption, { fontWeight: '700', color: simultaneousStyling ? colors.primaryDark : colors.ink }]}>
                        Yes, Same Time
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setSimultaneousStyling(false)}
                      style={{
                        flex: 1,
                        padding: spacing.sm,
                        borderRadius: radius.md,
                        backgroundColor: !simultaneousStyling ? colors.primarySoft : colors.surface,
                        borderWidth: 1.5,
                        borderColor: !simultaneousStyling ? colors.primary : colors.divider,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={[type.caption, { fontWeight: '700', color: !simultaneousStyling ? colors.primaryDark : colors.ink }]}>
                        No, Staggered
                      </Text>
                    </Pressable>
                  </View>
                  <Text style={[type.tiny, { color: simultaneousStyling ? colors.success : colors.muted, marginTop: 4, lineHeight: 16 }]}>
                    {simultaneousStyling
                      ? '✓ 1 Lead Artist + 1 Backup/Assistant Artist assigned so all persons are ready simultaneously.'
                      : '✓ 1 Lead Artist will style guests sequentially.'}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <SummaryRow icon="calendar-outline" label="Event Type" value={eventType} />
              <SummaryRow
                icon="today-outline"
                label={isMakeup && eventEndDate && eventEndDate !== eventDate ? 'Event Dates' : 'Event Date'}
                value={
                  isMakeup && eventEndDate && eventEndDate !== eventDate
                    ? `${formatLongDate(eventDate)} – ${formatLongDate(eventEndDate)}`
                    : formatLongDate(eventDate)
                }
              />
              <SummaryRow
                icon="people-outline"
                label={isMakeup ? 'Makeover Persons' : 'Guest Count'}
                value={isMakeup ? `${guestCount} person(s)` : `${guestCount} guests`}
              />
              {isMakeup && guestCount >= 2 && (
                <SummaryRow
                  icon="shield-checkmark-outline"
                  label="Staffing"
                  value={simultaneousStyling ? 'Lead + Backup Artist Assigned' : 'Sequential (1 Lead Artist)'}
                />
              )}
            </>
          )}
        </Card>

        <Input
          label="Event Location"
          icon="location-outline"
          value={location}
          onChangeText={setLocation}
          placeholder="Full address or area"
          containerStyle={{ marginTop: spacing.lg }}
        />

        {items.length > 0 && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Selected Services</Text>
            {items.map((it, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={[type.body, { color: colors.body, flex: 1 }]} numberOfLines={1}>
                  {it.name}{it.qty > 1 ? ` × ${it.qty}` : ''}
                </Text>
                <Text style={[type.bodyMedium, { color: colors.ink }]}>{formatCurrency(it.price * it.qty)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>Estimated Total</Text>
              <Text style={[type.h2, { color: colors.primaryDark }]}>{formatCurrency(total())}</Text>
            </View>
            <Text style={[type.tiny, { color: colors.muted, marginTop: 4 }]}>Final pricing confirmed by the provider after reviewing your enquiry.</Text>
          </Card>
        )}

        <Input
          label="Additional Requirements (optional)"
          icon="chatbox-ellipses-outline"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Need setup by 10 AM, parking for 20 vehicles"
          multiline
          numberOfLines={3}
          style={{ minHeight: 70, textAlignVertical: 'top' }}
          containerStyle={{ marginTop: spacing.md }}
        />

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Your Contact Details</Text>
          <SummaryRow icon="person-outline" label="Name" value={profile.name || 'Not set'} />
          <SummaryRow icon="call-outline" label="Mobile" value={`+91 ${profile.mobile}`} />
          <SummaryRow icon="logo-whatsapp" label="WhatsApp" value={`+91 ${profile.whatsapp}`} />
          <Text style={[type.tiny, { color: colors.muted, marginTop: 6 }]}>
            Shared with {provider.name} only after you submit this enquiry.
          </Text>
        </Card>

        <Button label="Submit Enquiry" icon="paper-plane" fullWidth size="lg" onPress={handleSubmit} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

function SummaryRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={15} color={colors.secondary} />
      <Text style={[type.caption, { color: colors.muted, marginLeft: 8, width: 90 }]}>{label}</Text>
      <Text style={[type.bodyMedium, { color: colors.ink, flex: 1 }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider,
  },
  dateCard: {
    width: 48, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.divider, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  dateCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
