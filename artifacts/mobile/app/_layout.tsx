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
import React, { useEffect } from "react";
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
  const { profile, isLoaded } = useUser();
  const { setUserId: setFamilyUserId } = useFamily();
  const { setUserId: setMealUserId } = useMeals();

  useEffect(() => {
    if (!isLoaded) return;
    if (!profile) {
      router.replace("/onboarding");
    } else {
      setFamilyUserId(profile.id);
      setMealUserId(profile.id);
    }
  }, [isLoaded, profile]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack>
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
    </Stack>
  );
}

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
