/**
 * src/screens/Splash.js
 * Loading Splash screen displayed while fonts and AsyncStorage profile state load.
 * Prevents screen flash for returning authenticated users.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import Logo from '../components/Logo';
import { colors, spacing } from '../theme';

export default function Splash() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryGreen} />
      <View style={styles.content}>
        <Logo width={220} height={50} textColor={colors.primaryYellow} />
        <ActivityIndicator
          size="large"
          color={colors.primaryYellow}
          style={styles.loader}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: spacing.xl,
  },
});
