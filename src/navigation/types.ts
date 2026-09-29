import { NavigatorScreenParams } from '@react-navigation/native';
import { ServiceCategoryId } from '../data/types';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Otp: { mobile: string };
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Explore: undefined;
  Enquiries: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  AuthFlow: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  CategorySelect: undefined;
  RequirementForm: { category: ServiceCategoryId };
  SearchResults: undefined;
  ProviderDetail: { providerId: string };
  DishSelection: { providerId: string };
  EnquiryForm: { providerId: string };
  EnquirySuccess: { enquiryId: string };
  EnquiryDetail: { enquiryId: string };
  RatingReview: { enquiryId: string };
  Notifications: undefined;
  EditProfile: undefined;
};
