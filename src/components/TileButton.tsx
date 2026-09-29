import React from 'react';
import { Pressable, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, type } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor?: string;
  iconBg?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TileButton({ icon, label, iconColor = colors.primary, iconBg, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tile, shadow.sm, { opacity: pressed ? 0.92 : 1 }, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg ?? iconColor + '18' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
