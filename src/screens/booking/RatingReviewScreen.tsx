import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, Button, Input, Card, RatingStars } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useEnquiryStore } from '../../store/useEnquiryStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingReview'>;

const categories: { key: 'quality' | 'communication' | 'value' | 'timeliness'; label: string }[] = [
  { key: 'quality', label: 'Service Quality' },
  { key: 'communication', label: 'Communication' },
  { key: 'value', label: 'Pricing / Value' },
  { key: 'timeliness', label: 'Timeliness' },
];

export function RatingReviewScreen({ navigation, route }: Props) {
  const enquiry = useEnquiryStore((s) => s.getById(route.params.enquiryId));
  const markReviewed = useEnquiryStore((s) => s.markReviewed);

  const [overall, setOverall] = useState(0);
  const [breakdown, setBreakdown] = useState<Record<string, number>>({ quality: 0, communication: 0, value: 0, timeliness: 0 });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!enquiry) return null;

  const handleSubmit = () => {
    if (overall === 0) {
      setError('Please give an overall rating');
      return;
    }
    markReviewed(enquiry.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Rate & Review" subtitle={enquiry.providerName} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }} keyboardShouldPersistTaps="handled">
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <Text style={[type.body, { color: colors.muted, marginBottom: spacing.md }]}>How was your overall experience?</Text>
          <RatingStars rating={overall} editable onChange={(v) => { setOverall(v); setError(''); }} size={18} />
          {error ? <Text style={[type.caption, { color: colors.danger, marginTop: 8 }]}>{error}</Text> : null}
        </Card>

        <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>Rate the Details</Text>
        <Card>
          {categories.map((c) => (
            <View key={c.key} style={styles.breakdownRow}>
              <Text style={[type.body, { color: colors.body, flex: 1 }]}>{c.label}</Text>
              <RatingStars
                rating={breakdown[c.key]}
                editable
                onChange={(v) => setBreakdown((b) => ({ ...b, [c.key]: v }))}
                size={13}
              />
            </View>
          ))}
        </Card>

        <Input
          label="Write a review (optional)"
          value={comment}
          onChangeText={setComment}
          placeholder="Share details about food quality, punctuality, communication..."
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
          containerStyle={{ marginTop: spacing.lg }}
        />

        <Button label="Submit Review" icon="star" fullWidth size="lg" onPress={handleSubmit} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
});
