/**
 * src/storage/profileStorage.js
 * AsyncStorage helper routines for user profile and app onboarding state.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  FIRST_NAME: '@zestly_first_name',
  LAST_NAME: '@zestly_last_name',
  EMAIL: '@zestly_email',
  PHONE: '@zestly_phone',
  AVATAR: '@zestly_avatar',
  NOTIFICATIONS: '@zestly_notifications',
  ONBOARDING_COMPLETED: '@zestly_onboarding_completed',
};

export const DEFAULT_NOTIFICATIONS = {
  orderStatuses: true,
  passwordChanges: true,
  specialOffers: true,
  newsletter: true,
};

/**
 * Loads entire user profile and onboarding status from AsyncStorage.
 */
export async function getProfile() {
  try {
    const keys = [
      STORAGE_KEYS.FIRST_NAME,
      STORAGE_KEYS.LAST_NAME,
      STORAGE_KEYS.EMAIL,
      STORAGE_KEYS.PHONE,
      STORAGE_KEYS.AVATAR,
      STORAGE_KEYS.NOTIFICATIONS,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    ];

    const pairs = await AsyncStorage.multiGet(keys);
    const data = Object.fromEntries(pairs);

    let parsedNotifications = DEFAULT_NOTIFICATIONS;
    if (data[STORAGE_KEYS.NOTIFICATIONS]) {
      try {
        parsedNotifications = JSON.parse(data[STORAGE_KEYS.NOTIFICATIONS]);
      } catch (e) {
        parsedNotifications = DEFAULT_NOTIFICATIONS;
      }
    }

    return {
      firstName: data[STORAGE_KEYS.FIRST_NAME] || '',
      lastName: data[STORAGE_KEYS.LAST_NAME] || '',
      email: data[STORAGE_KEYS.EMAIL] || '',
      phone: data[STORAGE_KEYS.PHONE] || '',
      avatar: data[STORAGE_KEYS.AVATAR] || null,
      notifications: parsedNotifications,
      onboardingCompleted: data[STORAGE_KEYS.ONBOARDING_COMPLETED] === 'true',
    };
  } catch (error) {
    console.error('Error reading profile from AsyncStorage:', error);
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: null,
      notifications: DEFAULT_NOTIFICATIONS,
      onboardingCompleted: false,
    };
  }
}

/**
 * Saves profile data to AsyncStorage.
 */
export async function saveProfile(profile) {
  try {
    const pairs = [
      [STORAGE_KEYS.FIRST_NAME, (profile.firstName || '').trim()],
      [STORAGE_KEYS.LAST_NAME, (profile.lastName || '').trim()],
      [STORAGE_KEYS.EMAIL, (profile.email || '').trim()],
      [STORAGE_KEYS.PHONE, (profile.phone || '').trim()],
      [STORAGE_KEYS.AVATAR, profile.avatar || ''],
      [
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(profile.notifications || DEFAULT_NOTIFICATIONS),
      ],
    ];

    if (profile.onboardingCompleted !== undefined) {
      pairs.push([
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        String(profile.onboardingCompleted),
      ]);
    }

    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error saving profile to AsyncStorage:', error);
    return false;
  }
}

/**
 * Saves initial onboarding data.
 */
export async function saveOnboarding(firstName, email) {
  try {
    const pairs = [
      [STORAGE_KEYS.FIRST_NAME, firstName.trim()],
      [STORAGE_KEYS.EMAIL, email.trim()],
      [STORAGE_KEYS.ONBOARDING_COMPLETED, 'true'],
      [STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS)],
    ];
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return false;
  }
}

/**
 * Clears all profile and onboarding storage keys (used during Logout).
 */
export async function clearProfile() {
  try {
    const allKeys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(allKeys);
    return true;
  } catch (error) {
    console.error('Error clearing profile:', error);
    return false;
  }
}

export default {
  STORAGE_KEYS,
  DEFAULT_NOTIFICATIONS,
  getProfile,
  saveProfile,
  saveOnboarding,
  clearProfile,
};
