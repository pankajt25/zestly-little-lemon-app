/**
 * src/components/CategoryChips.js
 * Horizontal scrollable row of selectable category chips for Menu breakdown.
 * Built dynamically from menu data.
 * Multi-select toggles with distinct active/inactive visual states.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../theme';

export default function CategoryChips({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
}) {
  const formatCategoryName = (cat) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ORDER FOR DELIVERY!</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              onPress={() => onToggleCategory(category)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${formatCategoryName(category)} category filter`}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {formatCategoryName(category)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  heading: {
    fontFamily: fonts.karlaExtraBold,
    fontSize: 16,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primaryGreen,
  },
  chipUnselected: {
    backgroundColor: colors.lightGrey,
  },
  chipText: {
    fontFamily: fonts.karlaBold,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipTextUnselected: {
    color: colors.primaryGreen,
  },
});
