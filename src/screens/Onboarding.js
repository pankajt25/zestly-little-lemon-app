/**
 * src/screens/Onboarding.js
 * Onboarding screen displayed on first app launch.
 * Collects and validates First Name and Email before navigating to Home.
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { isValidFirstName, isValidEmail } from '../utils/validation';
import { saveOnboarding } from '../storage/profileStorage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { AuthContext } from '../navigation/RootNavigator';

export default function Onboarding({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authContext = useContext(AuthContext);

  const isFirstNameValid = isValidFirstName(firstName);
  const isEmailValid = isValidEmail(email);
  const isFormValid = isFirstNameValid && isEmailValid;

  const handleNext = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await saveOnboarding(firstName, email);
      if (authContext && authContext.login) {
        await authContext.login({ firstName, email });
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Failed to save onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Header />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Restaurant Hero Banner */}
          <Hero showSearch={false} />

          {/* Form Content */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Let us get to know you</Text>
            <Text style={styles.subtitle}>
              Sign up with your name and email to explore our Mediterranean menu.
            </Text>

            {/* First Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  firstName.length > 0 && !isFirstNameValid && styles.inputError,
                ]}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
                autoCorrect={false}
                accessibilityLabel="First Name"
              />
              {firstName.length > 0 && !isFirstNameValid && (
                <Text style={styles.errorText}>
                  Please enter a valid first name (letters only).
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[
                  styles.input,
                  email.length > 0 && !isEmailValid && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleNext}
                accessibilityLabel="Email"
              />
              {email.length > 0 && !isEmailValid && (
                <Text style={styles.errorText}>
                  Please enter a valid email address.
                </Text>
              )}
            </View>
          </View>

          {/* Next Button Container */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                isFormValid ? styles.buttonActive : styles.buttonDisabled,
              ]}
              disabled={!isFormValid || isSubmitting}
              onPress={handleNext}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ disabled: !isFormValid }}
              accessibilityLabel="Next"
            >
              <Text
                style={[
                  styles.buttonText,
                  isFormValid ? styles.buttonTextActive : styles.buttonTextDisabled,
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  formContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontFamily: fonts.karlaBold,
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.karlaRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.karlaBold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fonts.karlaRegular,
    fontSize: 15,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
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
  footer: {
    marginTop: 'auto',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  button: {
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primaryYellow,
  },
  buttonDisabled: {
    backgroundColor: colors.disabledBackground,
  },
  buttonText: {
    fontFamily: fonts.karlaBold,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextActive: {
    color: colors.black,
  },
  buttonTextDisabled: {
    color: colors.disabledText,
  },
});
