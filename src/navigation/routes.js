/**
 * src/navigation/routes.js
 * Central navigation route definitions and AuthContext.
 * Isolated from screens to prevent require cycles with RootNavigator.
 */

import { createContext } from 'react';

export const ROUTES = {
  ONBOARDING: 'Onboarding',
  HOME: 'Home',
  PROFILE: 'Profile',
};

export const ROUTE_NAMES = ROUTES;

export const AuthContext = createContext({
  isOnboardingCompleted: false,
  userProfile: null,
  login: async () => {},
  logout: async () => {},
  updateProfile: () => {},
});
