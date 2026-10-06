/**
 * src/navigation/RootNavigator.js
 * Native Stack Navigator handling Onboarding, Home, and Profile screens.
 * Reads AsyncStorage onboarding status to prevent Onboarding flash for returning users.
 */

import React, { useState, useEffect, useMemo, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Splash from '../screens/Splash';
import { getProfile } from '../storage/profileStorage';

export const AuthContext = createContext({
  isOnboardingCompleted: false,
  userProfile: null,
  login: async () => {},
  logout: async () => {},
  updateProfile: () => {},
});

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function checkInitialState() {
      try {
        const profile = await getProfile();
        setIsOnboardingCompleted(Boolean(profile.onboardingCompleted));
        setUserProfile(profile);
      } catch (e) {
        console.error('Failed to load initial profile in RootNavigator:', e);
      } finally {
        setIsLoading(false);
      }
    }
    checkInitialState();
  }, []);

  const authContext = useMemo(
    () => ({
      isOnboardingCompleted,
      userProfile,
      login: async (newProfile) => {
        setIsOnboardingCompleted(true);
        setUserProfile((prev) => ({ ...prev, ...newProfile, onboardingCompleted: true }));
      },
      logout: async () => {
        setIsOnboardingCompleted(false);
        setUserProfile({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          avatar: null,
          onboardingCompleted: false,
        });
      },
      updateProfile: (updated) => {
        setUserProfile(updated);
      },
    }),
    [isOnboardingCompleted, userProfile]
  );

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isOnboardingCompleted ? 'Home' : 'Onboarding'}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
