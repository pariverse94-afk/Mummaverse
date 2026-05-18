import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { setBaseUrl } from "@workspace/api-client-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserProvider, useUser } from "@/context/UserContext";
import { FamilyProvider, useFamily } from "@/context/FamilyContext";
import { MealProvider, useMeals } from "@/context/MealContext";
import { CommunityProvider } from "@/context/CommunityContext";

if (process.env.EXPO_PUBLIC_DOMAIN) {
  setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoaded } = useUser();
  const { setUserId: setFamilyUserId } = useFamily();
  const { setUserId: setMealUserId } = useMeals();
  // Track whether we've already navigated into the app this session.
  // This avoids depending on useSegments() timing (which can be stale when
  // the profile-change effect fires, causing the navigation to be silently skipped).
  const inAppRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!session) {
      inAppRef.current = false;
      router.replace("/login");
    } else if (!profile) {
      inAppRef.current = false;
      router.replace("/onboarding");
    } else {
      setFamilyUserId(profile.id);
      setMealUserId(profile.id);
      // Navigate to tabs the first time we have a valid session + profile.
      // Subsequent profile updates (e.g. name edits) skip this so we don't
      // reset the user's tab position.
      if (!inAppRef.current) {
        inAppRef.current = true;
        router.replace("/(tabs)");
      }
    }
  }, [isLoaded, session, profile]);

  if (!isLoaded) {
    return (
      <View style={loadingStyles.container}>
        <View style={loadingStyles.logoCircle}>
          <Text style={loadingStyles.logoEmoji}>🏠</Text>
        </View>
        <ActivityIndicator size="large" color="#E07B39" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="firstaid/chat"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="meals/suggest"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="legal"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#E07B39",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 32 },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <FamilyProvider>
              <MealProvider>
                <CommunityProvider>
                  <GestureHandlerRootView>
                    <KeyboardProvider>
                      <NavigationGuard>
                        <RootLayoutNav />
                      </NavigationGuard>
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </CommunityProvider>
              </MealProvider>
            </FamilyProvider>
          </UserProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
