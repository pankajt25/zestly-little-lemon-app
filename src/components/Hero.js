/**
 * src/components/Hero.js
 * Restaurant Hero banner component.
 * Displays brand title (Little Lemon in yellow Markazi Text),
 * subtitle (Chicago in white Markazi Text),
 * description paragraph, rounded dish image on right,
 * and optional debounced search input bar below.
 */

import React from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors, fonts, spacing, borderRadius } from '../theme';

const DEFAULT_HERO_IMAGE = require('../../assets/hero.png');

export default function Hero({
  showSearch = true,
  searchQuery = '',
  onSearchChange,
  heroImage = DEFAULT_HERO_IMAGE,
}) {
  return (
    <View style={styles.container}>
      {/* Title & Subtitle */}
      <Text style={styles.title}>Little Lemon</Text>
      <Text style={styles.subtitle}>Chicago</Text>

      {/* Description & Image Row */}
      <View style={styles.contentRow}>
        <View style={styles.textColumn}>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={typeof heroImage === 'string' ? { uri: heroImage } : heroImage}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel="Little Lemon Mediterranean dish"
        />
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            {/* Search Icon */}
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
              <Circle cx="11" cy="11" r="7" stroke={colors.black} strokeWidth="2.2" />
              <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={colors.black} strokeWidth="2.2" strokeLinecap="round" />
            </Svg>
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              accessibilityLabel="Search menu items"
              accessibilityRole="search"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.markaziBold,
    fontSize: 48,
    lineHeight: 50,
    color: colors.primaryYellow,
    marginTop: -8,
  },
  subtitle: {
    fontFamily: fonts.markaziRegular,
    fontSize: 32,
    lineHeight: 34,
    color: colors.white,
    marginTop: -4,
    marginBottom: spacing.xs,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  textColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  description: {
    fontFamily: fonts.karlaMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.lightGrey,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardBackground,
  },
  searchContainer: {
    marginTop: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.karlaRegular,
    fontSize: 15,
    color: colors.black,
    paddingVertical: 0,
  },
});
