import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '../theme';
import { AvailabilityStatus, EnquiryStatus } from '../data/types';

const availabilityMeta: Record<AvailabilityStatus, { label: string; bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  available: { label: 'Available', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  unavailable: { label: 'Unavailable', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
  partial: { label: 'Partially Available', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  enquire: { label: 'Enquiry Required', bg: colors.infoSoft, fg: colors.info, icon: 'help-circle' },
};

export function AvailabilityBadge({ status, compact }: { status: AvailabilityStatus; compact?: boolean }) {
  const m = availabilityMeta[status];
  return (
    <View style={[styles.base, { backgroundColor: m.bg }]}>
      <Ionicons name={m.icon} size={12} color={m.fg} style={{ marginRight: 4 }} />
      <Text style={[type.tiny, { color: m.fg }]}>{compact ? m.label.split(' ')[0] : m.label}</Text>
    </View>
  );
}

export const enquiryStatusMeta: Record<EnquiryStatus, { label: string; bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  submitted: { label: 'Enquiry Submitted', bg: colors.infoSoft, fg: colors.info, icon: 'paper-plane' },
  provider_reviewing: { label: 'Provider Reviewing', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  provider_responded: { label: 'Provider Responded', bg: colors.primarySoft, fg: colors.primaryDark, icon: 'chatbubble-ellipses' },
  customer_reviewing: { label: 'Your Turn to Review', bg: colors.primarySoft, fg: colors.primaryDark, icon: 'alert-circle' },
  confirmation_pending: { label: 'Confirmation Pending', bg: colors.warningSoft, fg: colors.warning, icon: 'hourglass' },
  confirmed: { label: 'Confirmed', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  completed: { label: 'Completed', bg: colors.secondaryLight, fg: colors.secondaryDark, icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelled', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  const m = enquiryStatusMeta[status];
  return (
    <View style={[styles.base, { backgroundColor: m.bg }]}>
      <Ionicons name={m.icon} size={11} color={m.fg} style={{ marginRight: 4 }} />
      <Text style={[type.tiny, { color: m.fg }]}>{m.label}</Text>
    </View>
  );
}

export function VerifiedBadge() {
  return (
    <View style={[styles.base, { backgroundColor: colors.secondaryLight }]}>
      <Ionicons name="shield-checkmark" size={12} color={colors.secondaryDark} style={{ marginRight: 4 }} />
      <Text style={[type.tiny, { color: colors.secondaryDark }]}>Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
