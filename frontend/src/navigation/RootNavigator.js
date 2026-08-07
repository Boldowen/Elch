import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { useT } from '../localization';
import { TabBarVisibilityProvider, useTabBarVisibility } from './TabBarVisibilityContext';

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

function TabIcon({ label, focused, color }) {
  const icons = {
    Explore: focused ? 'compass' : 'compass-outline',
    Community: focused ? 'people' : 'people-outline',
    Trips: focused ? 'bag-handle' : 'bag-handle-outline',
    Inbox: focused ? 'chatbubble' : 'chatbubble-outline',
    Profile: focused ? 'person' : 'person-outline',
  };
  return <Ionicons name={icons[label] || 'ellipse-outline'} size={22} color={color} />;
}

function AnimatedTabBar(props) {
  const { visible } = useTabBarVisibility();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : 110,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.animatedTabBar, { opacity, transform: [{ translateY }] }]}
    >
      <BottomTabBar {...props} />
    </Animated.View>
  );
}

function Tabs() {
  const { t } = useT();
  const { setVisible } = useTabBarVisibility();
  const labels = {
    Explore: t('nav.explore'),
    Community: t('nav.community'),
    Trips: t('nav.trips'),
    Inbox: t('nav.inbox'),
    Profile: t('nav.profile'),
  };
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenListeners={{ tabPress: () => setVisible(true) }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: 'rgba(255,255,255,0.97)',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarLabel: labels[route.name],
        tabBarAccessibilityLabel: labels[route.name],
        tabBarIcon: ({ focused, color }) => (
          <TabIcon label={route.name} focused={focused} color={color} />
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

function MainTabs() {
  return (
    <TabBarVisibilityProvider>
      <Tabs />
    </TabBarVisibilityProvider>
  );
}

const styles = StyleSheet.create({
  animatedTabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});

export default function RootNavigator() {
  const { session, booting } = useAuth();

  if (booting) return null;

  return (
    <NavigationContainer
      theme={navTheme}
      linking={{ prefixes: ['elch://'], config: { screens: { VerifyEmail: 'verify-email', ResetPassword: 'reset-password' } } }}
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
