import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { useT } from '../localization';

import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CommunityScreen from '../screens/CommunityScreen';
import TripsScreen from '../screens/TripsScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import CategoryListingScreen from '../screens/CategoryListingScreen';
import GuidesScreen from '../screens/GuidesScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SavedTripsScreen from '../screens/SavedTripsScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import GuideRegistrationScreen from '../screens/GuideRegistrationScreen';
import GuideDashboardScreen from '../screens/GuideDashboardScreen';
import GuideProfileEditScreen from '../screens/GuideProfileEditScreen';
import GuideRankingScreen from '../screens/GuideRankingScreen';
import SafetyScreen from '../screens/SafetyScreen';
import AdminGuideApplicationsScreen from '../screens/AdminGuideApplicationsScreen';
import AdminReportsScreen from '../screens/AdminReportsScreen';
import CreateReviewScreen from '../screens/CreateReviewScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    primary: colors.brand,
    text: colors.ink,
    border: colors.border,
  },
};

function TabIcon({ label, focused }) {
  const icons = {
    Explore: '🧭',
    Community: '💬',
    Trips: '🧳',
    Inbox: '✉️',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 20 : 18, opacity: focused ? 1 : 0.55 }}>
      {icons[label] || '•'}
    </Text>
  );
}

function MainTabs() {
  const { t } = useT();
  const labels = {
    Explore: t('nav.explore'),
    Community: t('nav.community'),
    Trips: t('nav.trips'),
    Inbox: t('nav.inbox'),
    Profile: t('nav.profile'),
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarLabel: labels[route.name],
        tabBarAccessibilityLabel: labels[route.name],
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { session, booting } = useAuth();

  if (booting) return null;

  return (
    <NavigationContainer
      theme={navTheme}
      linking={{ prefixes: ['ventour://'], config: { screens: { VerifyEmail: 'verify-email', ResetPassword: 'reset-password' } } }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={session ? 'Main' : 'Welcome'}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen
          name="CategoryListing"
          component={CategoryListingScreen}
        />
        <Stack.Screen name="Guides" component={GuidesScreen} />
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
        />
        <Stack.Screen name="SavedTrips" component={SavedTripsScreen} />
        <Stack.Screen
          name="PaymentMethods"
          component={PaymentMethodsScreen}
        />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen
          name="GuideRegistration"
          component={GuideRegistrationScreen}
        />
        <Stack.Screen
          name="GuideDashboard"
          component={GuideDashboardScreen}
        />
        <Stack.Screen
          name="GuideProfileEdit"
          component={GuideProfileEditScreen}
        />
        <Stack.Screen name="GuideRanking" component={GuideRankingScreen} />
        <Stack.Screen name="Safety" component={SafetyScreen} />
        <Stack.Screen name="AdminGuideApplications" component={AdminGuideApplicationsScreen} />
        <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
        <Stack.Screen name="CreateReview" component={CreateReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
