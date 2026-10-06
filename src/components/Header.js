/**
 * src/components/Header.js
 * Universal app header with Little Lemon logo centered.
 * Supports left back button (green circle with white arrow) and right profile avatar.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Logo from './Logo';
import Avatar from './Avatar';
import { colors, spacing } from '../theme';

export default function Header({
  showBack = false,
  onBack,
  showAvatar = false,
  avatarUri = null,
  firstName = '',
  lastName = '',
  onAvatarPress,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Left slot: Back arrow or placeholder to balance layout */}
      <View style={styles.sideSlot}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {/* White back arrow */}
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke={colors.white}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center slot: Logo */}
      <View style={styles.centerSlot}>
        <Logo width={160} height={36} showText={true} />
      </View>

      {/* Right slot: Avatar or placeholder */}
      <View style={[styles.sideSlot, styles.rightSlot]}>
        {showAvatar ? (
          <Avatar
            source={avatarUri}
            firstName={firstName}
            lastName={lastName}
            size={40}
            onPress={onAvatarPress}
            accessibilityLabel="Open profile"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  sideSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
