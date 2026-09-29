import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';

import { CategorySelectScreen } from '../screens/discovery/CategorySelectScreen';
import { RequirementFormScreen } from '../screens/discovery/RequirementFormScreen';
import { SearchResultsScreen } from '../screens/discovery/SearchResultsScreen';
import { ProviderDetailScreen } from '../screens/discovery/ProviderDetailScreen';
import { DishSelectionScreen } from '../screens/booking/DishSelectionScreen';
import { EnquiryFormScreen } from '../screens/booking/EnquiryFormScreen';
import { EnquirySuccessScreen } from '../screens/booking/EnquirySuccessScreen';
import { EnquiryDetailScreen } from '../screens/booking/EnquiryDetailScreen';
import { RatingReviewScreen } from '../screens/booking/RatingReviewScreen';
import { NotificationsScreen } from '../screens/home/NotificationsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const ready = isAuthenticated && hasProfile;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {!ready ? (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="CategorySelect" component={CategorySelectScreen} />
          <Stack.Screen name="RequirementForm" component={RequirementFormScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
          <Stack.Screen name="DishSelection" component={DishSelectionScreen} />
          <Stack.Screen name="EnquiryForm" component={EnquiryFormScreen} />
          <Stack.Screen name="EnquirySuccess" component={EnquirySuccessScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="EnquiryDetail" component={EnquiryDetailScreen} />
          <Stack.Screen name="RatingReview" component={RatingReviewScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
