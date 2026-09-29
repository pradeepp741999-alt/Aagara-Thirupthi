import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '../theme';
import { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { ExploreScreen } from '../screens/home/ExploreScreen';
import { EnquiriesListScreen } from '../screens/booking/EnquiriesListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { useEnquiryStore } from '../store/useEnquiryStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { active: 'home', inactive: 'home-outline' },
  Explore: { active: 'compass', inactive: 'compass-outline' },
  Enquiries: { active: 'document-text', inactive: 'document-text-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function MainTabNavigator() {
  const activeEnquiryCount = useEnquiryStore((s) => s.enquiries.filter((e) => !['completed', 'cancelled'].includes(e.status)).length);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: type.caption.fontFamily, fontSize: 11, marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarStyle: [styles.tabBar, { height: 58 + insets.bottom, paddingBottom: insets.bottom + 6 }],
        tabBarIcon: ({ focused, color, size }) => {
          const meta = icons[route.name as keyof MainTabParamList];
          return (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Ionicons name={focused ? meta.active : meta.inactive} size={size - 2} color={color} />
            </View>
          );
        },
        tabBarBadge: route.name === 'Enquiries' && activeEnquiryCount > 0 ? activeEnquiryCount : undefined,
        tabBarBadgeStyle: { backgroundColor: colors.primary, fontSize: 10 },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="Enquiries" component={EnquiriesListScreen} options={{ title: 'Enquiries' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  iconWrap: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  activeIconWrap: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
