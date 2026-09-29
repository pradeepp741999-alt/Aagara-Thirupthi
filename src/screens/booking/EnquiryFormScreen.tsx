import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, Button, Input, Card, ProgressSteps, Chip, Stepper } from '../../components';
import { getProviderById } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { useCartStore } from '../../store/useCartStore';
import { useRequirementStore } from '../../store/useRequirementStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency } from '../../utils/currency';
import { formatLongDate, nextDays, toISODate, weekdayLabel } from '../../utils/date';
import { eventTypes } from '../../data/seed';

type Props = NativeStackScreenProps<RootStackParamList, 'EnquiryForm'>;

const upcomingDays = nextDays(10, 3);

export function EnquiryFormScreen({ navigation, route }: Props) {
  const provider = getProviderById(route.params.providerId);
  const requirement = useRequirementStore((s) => s.requirement);
  const updateRequirement = useRequirementStore((s) => s.updateRequirement);
  const { items, total, clearCart } = useCartStore();
  const submitEnquiry = useEnquiryStore((s) => s.submitEnquiry);
  const profile = useAuthStore((s) => s.profile);

  const [location, setLocation] = useState(requirement.location || `${profile.location ? profile.location + ', ' : ''}${profile.district}`);
  const [notes, setNotes] = useState(requirement.notes || '');
  const [editingDetails, setEditingDetails] = useState(!requirement.eventDate);
  const [eventType, setEventType] = useState(requirement.eventType);
  const [eventDate, setEventDate] = useState(requirement.eventDate);
  const [guestCount, setGuestCount] = useState(requirement.guestCount);

  if (!provider) return null;

  const handleSubmit = () => {
    updateRequirement({ eventType, eventDate, guestCount, location, notes });
    const enquiry = submitEnquiry({
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      eventType,
      eventDate,
      location,
      guestCount,
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

              <Text style={[type.caption, { color: colors.muted, marginBottom: 6 }]}>Event Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                {upcomingDays.map((d) => {
                  const iso = toISODate(d);
                  const active = eventDate === iso;
                  return (
                    <Pressable key={iso} style={[styles.dateCard, active && styles.dateCardActive]} onPress={() => setEventDate(iso)}>
                      <Text style={[type.tiny, { color: active ? colors.white : colors.muted }]}>{weekdayLabel(d)}</Text>
                      <Text style={[type.bodyMedium, { color: active ? colors.white : colors.ink, marginTop: 2 }]}>{d.getDate()}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={[type.caption, { color: colors.muted, marginBottom: 6 }]}>Guest Count</Text>
              <Stepper value={guestCount} onChange={setGuestCount} step={10} min={10} max={5000} suffix="guests" />
            </>
          ) : (
            <>
              <SummaryRow icon="calendar-outline" label="Event Type" value={eventType} />
              <SummaryRow icon="today-outline" label="Event Date" value={formatLongDate(eventDate)} />
              <SummaryRow icon="people-outline" label="Guest Count" value={`${guestCount} guests`} />
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
