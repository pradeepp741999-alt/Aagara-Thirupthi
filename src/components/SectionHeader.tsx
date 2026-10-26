import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, type } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: spacing.sm }}>
        <Text style={[type.h3, { color: colors.ink }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[type.bodyMedium, { color: colors.primary }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});
