/**
 * src/components/Avatar.js
 * Avatar component displaying user photo if available, or fallback initials
 * on a branded salmon/green circular background.
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme';

export default function Avatar({
  source,
  firstName = '',
  lastName = '',
  size = 44,
  backgroundColor = colors.secondarySalmon,
  textColor = colors.white,
  onPress,
  style,
  accessibilityLabel = 'User avatar',
}) {
  const [imageError, setImageError] = useState(false);

  // Compute initials: First letter of First Name + First letter of Last Name
  const getInitials = () => {
    const f = (firstName || '').trim().charAt(0).toUpperCase();
    const l = (lastName || '').trim().charAt(0).toUpperCase();
    if (f && l) return `${f}${l}`;
    if (f) return f;
    return 'LL'; // Little Lemon fallback
  };

  const hasImage = Boolean(source && typeof source === 'string' && source.trim().length > 0 && !imageError);

  const content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: hasImage ? 'transparent' : backgroundColor,
        },
        style,
      ]}
    >
      {hasImage ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: Math.max(12, Math.floor(size * 0.4)),
              color: textColor,
            },
          ]}
        >
          {getInitials()}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#E2E8F0',
  },
  initials: {
    fontFamily: fonts.karlaBold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
