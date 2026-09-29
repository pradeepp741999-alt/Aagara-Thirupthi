import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Avatar, Card } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const enquiries = useEnquiryStore((s) => s.enquiries);

  const activeCount = enquiries.filter((e) => !['completed', 'cancelled'].includes(e.status)).length;
  const completedCount = enquiries.filter((e) => e.status === 'completed').length;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; tone?: 'danger' }[] = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: 'document-text-outline', label: 'My Enquiries & Bookings', onPress: () => navigation.navigate('MainTabs') },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security', onPress: () => Alert.alert('Privacy & Security', 'Your contact details are only shared with a provider after you submit an enquiry to them.') },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Help & Support', 'For assistance, reach us at support@aagarathirupthi.app') },
    { icon: 'information-circle-outline', label: 'About Aagara Thirupthi', onPress: () => Alert.alert('Aagara Thirupthi', 'A location-based marketplace to discover, compare and book event service providers — starting with catering, expanding to decoration, audio and more.') },
    { icon: 'log-out-outline', label: 'Log Out', onPress: handleLogout, tone: 'danger' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.header}>
          <Avatar name={profile.name || 'A'} size={64} color={profile.avatarColor} />
          <Text style={[type.h1, { color: colors.ink, marginTop: spacing.md }]}>{profile.name || 'Guest User'}</Text>
          <Text style={[type.body, { color: colors.muted, marginTop: 2 }]}>+91 {profile.mobile}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location" size={13} color={colors.muted} />
            <Text style={[type.caption, { color: colors.muted, marginLeft: 4 }]}>
              {profile.location ? `${profile.location}, ` : ''}{profile.district}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[type.h1, { color: colors.primary }]}>{activeCount}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Active Enquiries</Text>
          </Card>
          <Card style={[styles.statCard, { marginLeft: spacing.md }]}>
            <Text style={[type.h1, { color: colors.secondary }]}>{completedCount}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Completed Bookings</Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
          {menuItems.map((item) => (
            <Pressable key={item.label} style={[styles.menuRow, shadow.sm]} onPress={item.onPress}>
              <Ionicons name={item.icon} size={19} color={item.tone === 'danger' ? colors.danger : colors.secondary} />
              <Text style={[type.bodyMedium, { color: item.tone === 'danger' ? colors.danger : colors.ink, marginLeft: spacing.md, flex: 1 }]}>
                {item.label}
              </Text>
              {item.tone !== 'danger' && <Ionicons name="chevron-forward" size={18} color={colors.faint} />}
            </Pressable>
          ))}
        </View>

        <Text style={[type.tiny, { color: colors.faint, textAlign: 'center', marginTop: spacing.xl }]}>
          Aagara Thirupthi · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.sm,
  },
});
