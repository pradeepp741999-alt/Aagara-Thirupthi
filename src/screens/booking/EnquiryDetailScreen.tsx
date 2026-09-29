import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { ScreenHeader, Button, Card, StatusBadge } from '../../components';
import { getProviderById } from '../../data/providers';
import { RootStackParamList } from '../../navigation/types';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { formatCurrency } from '../../utils/currency';
import { formatLongDate } from '../../utils/date';
import { EnquiryStatus } from '../../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EnquiryDetail'>;

const stepLabels = ['Submitted', 'Reviewing', 'Responded', 'Confirmed', 'Completed'];

function stepIndexFor(status: EnquiryStatus) {
  switch (status) {
    case 'submitted': return 0;
    case 'provider_reviewing': return 1;
    case 'provider_responded':
    case 'customer_reviewing': return 2;
    case 'confirmation_pending':
    case 'confirmed': return 3;
    case 'completed': return 4;
    default: return 0;
  }
}

export function EnquiryDetailScreen({ navigation, route }: Props) {
  const enquiry = useEnquiryStore((s) => s.getById(route.params.enquiryId));
  const updateStatus = useEnquiryStore((s) => s.updateStatus);
  const provider = enquiry ? getProviderById(enquiry.providerId) : undefined;

  if (!enquiry) return null;

  const isCancelled = enquiry.status === 'cancelled';
  const stepIndex = stepIndexFor(enquiry.status);

  const handleAccept = () => {
    updateStatus(enquiry.id, 'confirmed');
  };

  const handleCancel = () => {
    Alert.alert('Cancel Enquiry', 'Are you sure you want to cancel this enquiry?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => updateStatus(enquiry.id, 'cancelled') },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={`Enquiry #${enquiry.id.replace('enq-', '')}`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        {!isCancelled ? (
          <View style={styles.stepsRow}>
            {stepLabels.map((label, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <React.Fragment key={label}>
                  <View style={styles.stepCol}>
                    <View style={[styles.stepDot, { backgroundColor: done || active ? colors.primary : colors.surface, borderColor: done || active ? colors.primary : colors.border }]}>
                      {done ? <Ionicons name="checkmark" size={12} color={colors.white} /> : null}
                    </View>
                    <Text style={[type.tiny, { color: active ? colors.ink : colors.muted, marginTop: 4, textAlign: 'center' }]} numberOfLines={1}>{label}</Text>
                  </View>
                  {i < stepLabels.length - 1 && <View style={[styles.stepLine, { backgroundColor: done ? colors.primary : colors.border }]} />}
                </React.Fragment>
              );
            })}
          </View>
        ) : (
          <View style={styles.cancelledBanner}>
            <Ionicons name="close-circle" size={18} color={colors.danger} />
            <Text style={[type.bodyMedium, { color: colors.danger, marginLeft: 8 }]}>This enquiry was cancelled</Text>
          </View>
        )}

        <Card style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { color: colors.ink }]}>{enquiry.providerName}</Text>
              <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{provider?.tagline}</Text>
            </View>
            <StatusBadge status={enquiry.status} />
          </View>
          {provider && (
            <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
              <Pressable style={styles.contactBtn} onPress={() => Linking.openURL(`tel:+91${provider.contactNumber}`)}>
                <Ionicons name="call" size={16} color={colors.secondary} />
                <Text style={[type.caption, { color: colors.secondary, marginLeft: 6 }]}>Call</Text>
              </Pressable>
              <Pressable style={[styles.contactBtn, { marginLeft: spacing.sm }]} onPress={() => Linking.openURL(`https://wa.me/91${provider.contactNumber}`)}>
                <Ionicons name="logo-whatsapp" size={16} color={colors.success} />
                <Text style={[type.caption, { color: colors.success, marginLeft: 6 }]}>WhatsApp</Text>
              </Pressable>
              <Pressable
                style={[styles.contactBtn, { marginLeft: spacing.sm }]}
                onPress={() => navigation.navigate('ProviderDetail', { providerId: provider.id })}
              >
                <Ionicons name="storefront-outline" size={16} color={colors.primary} />
                <Text style={[type.caption, { color: colors.primary, marginLeft: 6 }]}>View Profile</Text>
              </Pressable>
            </View>
          )}
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Event Details</Text>
          <DetailRow icon="calendar-outline" label="Event Type" value={enquiry.eventType} />
          <DetailRow icon="today-outline" label="Event Date" value={formatLongDate(enquiry.eventDate)} />
          <DetailRow icon="location-outline" label="Location" value={enquiry.location} />
          <DetailRow icon="people-outline" label="Guests" value={`${enquiry.guestCount}`} />
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.sm }]}>Requested Services</Text>
          {enquiry.items.map((it, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={[type.body, { color: colors.body, flex: 1 }]}>{it.name}{it.qty > 1 ? ` × ${it.qty}` : ''}</Text>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{it.price > 0 ? formatCurrency(it.price * it.qty) : '—'}</Text>
            </View>
          ))}
          {enquiry.notes ? <Text style={[type.caption, { color: colors.muted, marginTop: spacing.sm }]}>Note: {enquiry.notes}</Text> : null}
        </Card>

        {enquiry.status === 'provider_responded' && (
          <Card style={{ marginTop: spacing.md, borderColor: colors.primary, borderWidth: 1.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
              <Ionicons name="chatbubble-ellipses" size={18} color={colors.primary} />
              <Text style={[type.h3, { color: colors.ink, marginLeft: 8 }]}>Provider's Response</Text>
            </View>
            <Text style={[type.body, { color: colors.body, lineHeight: 21 }]}>{enquiry.providerMessage}</Text>
            {enquiry.providerQuote && (
              <Text style={[type.h2, { color: colors.primaryDark, marginTop: spacing.md }]}>{formatCurrency(enquiry.providerQuote)}</Text>
            )}
            <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
              <Button label="Confirm Booking" icon="checkmark" onPress={handleAccept} style={{ flex: 1, marginRight: spacing.sm }} />
              <Button label="Decline" variant="outline" onPress={handleCancel} style={{ flex: 1 }} />
            </View>
          </Card>
        )}

        {enquiry.status === 'confirmed' && (
          <View style={styles.confirmedBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[type.bodyMedium, { color: colors.success, marginLeft: 8, flex: 1 }]}>
              Booking confirmed! {enquiry.providerName} will contact you closer to the event date.
            </Text>
          </View>
        )}

        {enquiry.status === 'completed' && !enquiry.hasReview && (
          <Button
            label="Rate & Review This Provider"
            icon="star"
            fullWidth
            size="lg"
            onPress={() => navigation.navigate('RatingReview', { enquiryId: enquiry.id })}
            style={{ marginTop: spacing.lg }}
          />
        )}

        {['submitted', 'provider_reviewing'].includes(enquiry.status) && (
          <Button label="Cancel Enquiry" variant="outline" fullWidth onPress={handleCancel} style={{ marginTop: spacing.lg }} />
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.itemRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Ionicons name={icon} size={15} color={colors.secondary} />
        <Text style={[type.caption, { color: colors.muted, marginLeft: 8 }]}>{label}</Text>
      </View>
      <Text style={[type.bodyMedium, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stepsRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { alignItems: 'center', width: 60 },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepLine: { flex: 1, height: 2, marginTop: 10, marginHorizontal: -6 },
  cancelledBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dangerSoft, padding: spacing.md, borderRadius: radius.lg },
  confirmedBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, padding: spacing.md, borderRadius: radius.lg, marginTop: spacing.lg },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 7, borderWidth: 1, borderColor: colors.divider,
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
});
