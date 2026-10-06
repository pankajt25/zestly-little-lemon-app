/**
 * src/components/Logo.js
 * Scalable SVG Logo component for Little Lemon restaurant.
 * Consists of a vibrant yellow lemon mark with green leaf,
 * alongside spaced serif capitals "LITTLE LEMON".
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, G, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

export default function Logo({ width = 180, height = 40, showText = true, textColor = colors.primaryGreen }) {
  const aspectRatio = showText ? 180 / 40 : 40 / 40;
  const computedHeight = height || width / aspectRatio;

  return (
    <View style={[styles.container, { width, height: computedHeight }]}>
      <Svg
        width={width}
        height={computedHeight}
        viewBox={showText ? '0 0 190 40' : '0 0 40 40'}
        fill="none"
        accessibilityLabel="Little Lemon Logo"
        accessible={Platform.OS !== 'web' ? true : undefined}
      >
        {/* Lemon Icon Mark */}
        <G transform="translate(2, 2)">
          {/* Lemon body (oval tilted with pointed tips) */}
          <Path
            d="M 18 8 C 26 8, 33 13, 34 20 C 35 25, 31 31, 23 33 C 14 34, 5 30, 4 23 C 3 17, 9 9, 18 8 Z"
            fill={colors.primaryYellow}
            stroke="#E0BC0C"
            strokeWidth="1"
          />
          {/* Lemon left and right tip points */}
          <Path
            d="M 3.8 23.2 C 1.5 24.5 1.5 22 2.8 20.5 C 3.5 19.8 4.2 21 3.8 23.2 Z"
            fill={colors.primaryYellow}
          />
          <Path
            d="M 33.8 19.5 C 36 18.5 36 21 34.5 22.5 C 34 23 33.2 21.5 33.8 19.5 Z"
            fill={colors.primaryYellow}
          />

          {/* Leaf on top */}
          <Path
            d="M 19 8 C 22 1, 31 2, 33 6 C 30 11, 23 11, 19 8 Z"
            fill={colors.primaryGreen}
          />
          {/* Leaf vein */}
          <Path
            d="M 21 7 C 25 5, 29 5, 31 6"
            stroke="#708780"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Stem */}
          <Path
            d="M 19 8 C 18 5, 17 4, 15 4"
            stroke={colors.primaryGreen}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </G>

        {/* Text "LITTLE LEMON" */}
        {showText && (
          <SvgText
            x="48"
            y="26"
            fill={textColor}
            fontSize="18"
            fontWeight="bold"
            letterSpacing="3.5"
            fontFamily="serif"
          >
            LITTLE LEMON
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
