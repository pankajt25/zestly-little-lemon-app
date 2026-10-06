/**
 * App.js
 * Root entry point for Zestly (Little Lemon food ordering app).
 * Loads Markazi Text and Karla typography fonts before displaying screens.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  MarkaziText_400Regular,
  MarkaziText_500Medium,
  MarkaziText_600SemiBold,
  MarkaziText_700Bold,
} from '@expo-google-fonts/markazi-text';
import {
  Karla_400Regular,
  Karla_500Medium,
  Karla_700Bold,
  Karla_800ExtraBold,
} from '@expo-google-fonts/karla';

import RootNavigator from './src/navigation/RootNavigator';
import Splash from './src/screens/Splash';

export default function App() {
  const [fontsLoaded] = useFonts({
    MarkaziText_400Regular,
    MarkaziText_500Medium,
    MarkaziText_600SemiBold,
    MarkaziText_700Bold,
    Karla_400Regular,
    Karla_500Medium,
    Karla_700Bold,
    Karla_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
