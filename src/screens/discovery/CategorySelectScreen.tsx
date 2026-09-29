import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { ScreenHeader } from '../../components';
import { categories, futureCategories } from '../../data/categories';
import { RootStackParamList } from '../../navigation/types';
import { useRequirementStore } from '../../store/useRequirementStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CategorySelect'>;

export function CategorySelectScreen({ navigation }: Props) {
  const setCategory = useRequirementStore((s) => s.setCategory);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="What do you need?" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[type.body, { color: colors.muted, marginBottom: spacing.lg }]}>
          Choose a service category to start discovering providers for your event.
        </Text>

        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.card, shadow.sm, { opacity: pressed ? 0.92 : 1 }]}
            onPress={() => {
              setCategory(cat.id);
              navigation.navigate('RequirementForm', { category: cat.id });
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
              <Ionicons name={cat.icon as any} size={26} color={cat.color} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text style={[type.h3, { color: colors.ink }]}>{cat.name}</Text>
              <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{cat.tagline}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.faint} />
          </Pressable>
        ))}

        <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xxl, marginBottom: spacing.md }]}>
          More services, coming soon
        </Text>
        <View style={styles.futureGrid}>
          {futureCategories.map((f) => (
            <View key={f.id} style={styles.futureChip}>
              <Ionicons name={f.icon as any} size={15} color={colors.muted} />
              <Text style={[type.caption, { color: colors.muted, marginLeft: 6 }]}>{f.name}</Text>
            </View>
          ))}
        </View>
        <Text style={[type.caption, { color: colors.faint, marginTop: spacing.md, lineHeight: 18 }]}>
          Aagara Thirupthi is built to grow — these categories will open up on the same platform as we onboard more providers.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.xl, paddingBottom: spacing.huge },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  iconCircle: { width: 54, height: 54, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  futureGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  futureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});
