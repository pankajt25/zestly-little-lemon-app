/**
 * src/screens/Profile.js
 * User Profile screen.
 * Displays personal details, avatar image picker (Change/Remove),
 * notification toggles, save/discard changes, and logout confirmation.
 */

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import {
  getProfile,
  saveProfile,
  clearProfile,
  DEFAULT_NOTIFICATIONS,
} from '../storage/profileStorage';
import {
  isValidFirstName,
  isValidLastName,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
} from '../utils/validation';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { AuthContext, ROUTES } from '../navigation/routes';

export default function Profile({ navigation }) {
  const authContext = useContext(AuthContext);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  // Field validation touched states
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  // Load profile data from AsyncStorage
  const loadSavedData = useCallback(async () => {
    const data = await getProfile();
    setFirstName(data.firstName || '');
    setLastName(data.lastName || '');
    setEmail(data.email || '');
    setPhone(data.phone || '');
    setAvatar(data.avatar || null);
    setNotifications(data.notifications || DEFAULT_NOTIFICATIONS);
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
    });
  }, []);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  // Validation checks
  const isFirstNameValid = isValidFirstName(firstName);
  const isLastNameValid = isValidLastName(lastName);
  const isEmailValid = isValidEmail(email);
  const isPhoneValid = isValidPhoneNumber(phone);
  const isFormValid =
    isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid;

  // Phone input handler with auto-masking
  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  // Avatar Image Picker
  const handleChangeAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permission is required to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  // Notification toggle helper
  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Discard changes: reload last saved storage values
  const handleDiscardChanges = async () => {
    await loadSavedData();
    Alert.alert('Changes Discarded', 'Reverted back to previously saved values.');
  };

  // Save changes to AsyncStorage
  const handleSaveChanges = async () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    });

    if (!isFormValid) {
      Alert.alert(
        'Invalid Input',
        'Please correct highlighted errors before saving.'
      );
      return;
    }

    const updatedProfile = {
      firstName,
      lastName,
      email,
      phone,
      avatar,
      notifications,
      onboardingCompleted: true,
    };

    const success = await saveProfile(updatedProfile);
    if (success) {
      if (authContext && authContext.updateProfile) {
        authContext.updateProfile(updatedProfile);
      }
      Alert.alert('Success', 'Profile changes saved successfully!');
    } else {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  // Logout confirmation and storage wipe
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? All stored profile information will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            // Clear in-memory state
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setAvatar(null);
            setNotifications(DEFAULT_NOTIFICATIONS);

            if (authContext && authContext.logout) {
              await authContext.logout();
            }

            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {/* Header with Back arrow, centered logo, and avatar */}
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        showAvatar={true}
        avatarUri={avatar}
        firstName={firstName}
        lastName={lastName}
        onAvatarPress={() => {}}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal information</Text>

            {/* Avatar Row */}
            <Text style={styles.avatarLabel}>Avatar</Text>
            <View style={styles.avatarRow}>
              <Avatar
                source={avatar}
                firstName={firstName}
                lastName={lastName}
                size={75}
              />
              <View style={styles.avatarButtons}>
                <TouchableOpacity
                  style={styles.changeBtn}
                  onPress={handleChangeAvatar}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Change avatar"
                >
                  <Text style={styles.changeBtnText}>Change</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={handleRemoveAvatar}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Remove avatar"
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* First Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>First name *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.firstName && !isFirstNameValid && styles.inputError,
                ]}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setTouched((prev) => ({ ...prev, firstName: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, firstName: true }))
                }
                autoCapitalize="words"
                placeholder="First name"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="First name input"
              />
              {touched.firstName && !isFirstNameValid && (
                <Text style={styles.errorText}>
                  First name is required (letters only).
                </Text>
              )}
            </View>

            {/* Last Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Last name</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.lastName && !isLastNameValid && styles.inputError,
                ]}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setTouched((prev) => ({ ...prev, lastName: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, lastName: true }))
                }
                autoCapitalize="words"
                placeholder="Last name"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Last name input"
              />
              {touched.lastName && !isLastNameValid && (
                <Text style={styles.errorText}>
                  Please enter valid letters for last name.
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email *</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.email && !isEmailValid && styles.inputError,
                ]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setTouched((prev) => ({ ...prev, email: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, email: true }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email address"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Email input"
              />
              {touched.email && !isEmailValid && (
                <Text style={styles.errorText}>
                  Please enter a valid email address.
                </Text>
              )}
            </View>

            {/* Phone Number Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.phone && !isPhoneValid && styles.inputError,
                ]}
                value={phone}
                onChangeText={handlePhoneChange}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, phone: true }))
                }
                keyboardType="phone-pad"
                placeholder="(217) 555-0113"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Phone number input"
              />
              {touched.phone && !isPhoneValid && (
                <Text style={styles.errorText}>
                  Phone number must have 10 digits e.g. (217) 555-0113.
                </Text>
              )}
            </View>

            {/* Email Notifications Section */}
            <View style={styles.notificationsSection}>
              <Text style={styles.notificationTitle}>Email notifications</Text>

              {/* Checkbox 1: Order statuses */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleToggleNotification('orderStatuses')}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: Boolean(notifications.orderStatuses) }}
              >
                <Checkbox
                  value={Boolean(notifications.orderStatuses)}
                  onValueChange={() => handleToggleNotification('orderStatuses')}
                  color={
                    notifications.orderStatuses ? colors.primaryGreen : undefined
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Order statuses</Text>
              </TouchableOpacity>

              {/* Checkbox 2: Password changes */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleToggleNotification('passwordChanges')}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: Boolean(notifications.passwordChanges) }}
              >
                <Checkbox
                  value={Boolean(notifications.passwordChanges)}
                  onValueChange={() => handleToggleNotification('passwordChanges')}
                  color={
                    notifications.passwordChanges
                      ? colors.primaryGreen
                      : undefined
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Password changes</Text>
              </TouchableOpacity>

              {/* Checkbox 3: Special offers */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleToggleNotification('specialOffers')}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: Boolean(notifications.specialOffers) }}
              >
                <Checkbox
                  value={Boolean(notifications.specialOffers)}
                  onValueChange={() => handleToggleNotification('specialOffers')}
                  color={
                    notifications.specialOffers ? colors.primaryGreen : undefined
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Special offers</Text>
              </TouchableOpacity>

              {/* Checkbox 4: Newsletter */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => handleToggleNotification('newsletter')}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: Boolean(notifications.newsletter) }}
              >
                <Checkbox
                  value={Boolean(notifications.newsletter)}
                  onValueChange={() => handleToggleNotification('newsletter')}
                  color={
                    notifications.newsletter ? colors.primaryGreen : undefined
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Newsletter</Text>
              </TouchableOpacity>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              <Text style={styles.logoutBtnText}>Log out</Text>
            </TouchableOpacity>

            {/* Bottom Actions Row: Discard & Save */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.discardBtn}
                onPress={handleDiscardChanges}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Discard changes"
              >
                <Text style={styles.discardBtnText}>Discard changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveChanges}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Save changes"
              >
                <Text style={styles.saveBtnText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sectionTitle: {
    fontFamily: fonts.karlaBold,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.md,
  },
  avatarLabel: {
    fontFamily: fonts.karlaMedium,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarButtons: {
    flexDirection: 'row',
    marginLeft: spacing.md,
    gap: spacing.sm,
  },
  changeBtn: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  changeBtnText: {
    fontFamily: fonts.karlaBold,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  removeBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  removeBtnText: {
    fontFamily: fonts.karlaBold,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: fonts.karlaBold,
    fontSize: 13,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fonts.karlaRegular,
    fontSize: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    color: colors.black,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: fonts.karlaRegular,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  notificationsSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  notificationTitle: {
    fontFamily: fonts.karlaBold,
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
    width: 20,
    height: 20,
  },
  checkboxLabel: {
    fontFamily: fonts.karlaRegular,
    fontSize: 15,
    color: colors.black,
  },
  logoutBtn: {
    backgroundColor: colors.primaryYellow,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoutBtnText: {
    fontFamily: fonts.karlaBold,
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  discardBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardBtnText: {
    fontFamily: fonts.karlaBold,
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: fonts.karlaBold,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
