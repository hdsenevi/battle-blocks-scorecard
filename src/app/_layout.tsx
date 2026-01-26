import '../../global.css';
import { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LightNavigationTheme, DarkNavigationTheme } from '@/constants/theme';
import { GameProvider } from '@/contexts/GameContext';
import { AppLifecycleHandler } from '@/components/AppLifecycleHandler';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Keep splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <GameProvider>
      <AppLifecycleHandler />
      <ThemeProvider value={colorScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GameProvider>
  );
}
