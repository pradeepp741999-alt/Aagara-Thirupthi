import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { Button, Card } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'EnquirySuccess'>;

export function EnquirySuccessScreen({ navigation, route }: Props) {
  const enquiry = useEnquiryStore((s) => s.getById(route.params.enquiryId));

  if (!enquiry) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={44} color={colors.white} />
        </View>
        <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl, textAlign: 'center' }]}>Enquiry Sent!</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 8, textAlign: 'center' }]}>
          {enquiry.providerName} has received your enquiry and will respond soon. You'll get a notification the moment they reply.
        </Text>

        <Card style={{ marginTop: spacing.xxl, width: '100%' }}>
          <Row label="Enquiry ID" value={`#${enquiry.id.replace('enq-', '')}`} />
          <Row label="Event" value={`${enquiry.eventType} · ${enquiry.guestCount} guests`} />
          {enquiry.estimatedTotal > 0 && <Row label="Estimated Total" value={formatCurrency(enquiry.estimatedTotal)} />}
          <Row label="Status" value="Enquiry Submitted" highlight />
        </Card>

        <View style={{ width: '100%', marginTop: spacing.xxl }}>
          <Button label="View Enquiry Status" icon="document-text" fullWidth size="lg" onPress={() => navigation.replace('EnquiryDetail', { enquiryId: enquiry.id })} />
          <Button
            label="Back to Home"
            variant="outline"
            fullWidth
            size="lg"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[type.caption, { color: colors.muted }]}>{label}</Text>
      <Text style={[type.bodyMedium, { color: highlight ? colors.success : colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  successCircle: {
    width: 92, height: 92, borderRadius: radius.xxl + 10, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
