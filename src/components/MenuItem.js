/**
 * src/components/MenuItem.js
 * Food menu list row item.
 * Displays dish name (bold), description truncated to 2 lines with ellipsis,
 * formatted price ($12.99), and dish image on the right (rounded, fixed 90x90).
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../theme';

// Local bundled fallbacks for dishes
const LOCAL_DISH_IMAGES = {
  'greeksalad.jpg': require('../../assets/dishes/greekSalad.jpg'),
  'bruschetta.jpg': require('../../assets/dishes/bruschetta.jpg'),
  'grilledfish.jpg': require('../../assets/dishes/grilledFish.jpg'),
  'pasta.jpg': require('../../assets/dishes/pasta.jpg'),
  'lemondessert.jpg': require('../../assets/dishes/lemonDessert.jpg'),
  'lemonade.jpg': require('../../assets/dishes/lemonade.jpg'),
  'baklava.jpg': require('../../assets/dishes/baklava.jpg'),
  'pitahummus.jpg': require('../../assets/dishes/pitaHummus.jpg'),
  'lambchops.jpg': require('../../assets/dishes/lambChops.jpg'),
  'icedtea.jpg': require('../../assets/dishes/icedTea.jpg'),
};

const DEFAULT_FALLBACK_IMAGE = require('../../assets/hero.png');

export default function MenuItem({ item }) {
  const [imageFailed, setImageFailed] = useState(false);

  // Price formatting
  const formattedPrice = typeof item.price === 'number'
    ? `$${item.price.toFixed(2)}`
    : `$${parseFloat(item.price || 0).toFixed(2)}`;

  // Determine image source
  const getImageSource = () => {
    if (imageFailed || !item.image) {
      const cleanKey = (item.image || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
      return LOCAL_DISH_IMAGES[cleanKey] || DEFAULT_FALLBACK_IMAGE;
    }

    if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
      return { uri: item.image };
    }

    // Remote Meta GitHub image repository
    const remoteUrl = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
    return { uri: remoteUrl };
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          accessibilityLabel={item.name}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    fontFamily: fonts.karlaBold,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: fonts.karlaRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  price: {
    fontFamily: fonts.karlaBold,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  image: {
    width: 90,
    height: 90,
  },
});
