import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    setInfo("");

    const { error: authError } = mode === "signup"
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else if (mode === "signup") {
      setInfo("Account created! Check your email to confirm, then sign in.");
    }
    // NavigationGuard in _layout.tsx handles redirect on session change
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    setInfo("");

    try {
      if (Platform.OS === "web") {
        // On web: full-page redirect flow. Supabase will send the user to Google,
        // then Google redirects back to Supabase callback, then Supabase redirects
        // to our page. detectSessionInUrl:true in supabase.ts picks up the tokens.
        const redirectTo = typeof window !== "undefined"
          ? window.location.origin + "/"
          : undefined;
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (oauthError) {
          setError(oauthError.message);
          setGoogleLoading(false);
        }
        // Page will navigate away — keep loading spinner until redirect happens.
      } else {
        // On native (iOS / Android): in-app browser popup with deep-link callback.
        const redirectUrl = Linking.createURL("/");
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
        });

        if (oauthError || !data.url) {
          setError(
            oauthError?.message ??
            "Google sign-in is not configured yet. Enable Google provider in your Supabase dashboard."
          );
          setGoogleLoading(false);
          return;
        }

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === "success" && result.url) {
          const hash = result.url.split("#")[1] ?? "";
          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (sessionError) setError(sessionError.message);
          } else {
            setError("Could not complete Google sign-in. Please try email instead.");
          }
        }
        setGoogleLoading(false);
      }
    } catch {
      setError("Google sign-in requires setup in Supabase dashboard. Use email sign-in for now.");
      setGoogleLoading(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.trim().length >= 6 && !loading;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🏠</Text>
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>Pariverse</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Your family, organised.
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={[styles.modeToggle, { backgroundColor: colors.muted }]}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === "signin" && [styles.modeBtnActive, { backgroundColor: colors.background }],
            ]}
            onPress={() => { setMode("signin"); setError(""); setInfo(""); }}
          >
            <Text
              style={[
                styles.modeBtnText,
                { color: mode === "signin" ? colors.foreground : colors.mutedForeground },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === "signup" && [styles.modeBtnActive, { backgroundColor: colors.background }],
            ]}
            onPress={() => { setMode("signup"); setError(""); setInfo(""); }}
          >
            <Text
              style={[
                styles.modeBtnText,
                { color: mode === "signup" ? colors.foreground : colors.mutedForeground },
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Google SSO */}
        <TouchableOpacity
          style={[styles.googleBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color={colors.foreground} />
          ) : (
            <>
              <View style={styles.googleLogo}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={[styles.googleBtnText, { color: colors.foreground }]}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Email */}
        <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border },
          ]}
          placeholder="you@example.com"
          placeholderTextColor={colors.mutedForeground}
          value={email}
          onChangeText={(t) => { setEmail(t); setError(""); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          testID="email-input"
        />

        {/* Password */}
        <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border },
          ]}
          placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
          placeholderTextColor={colors.mutedForeground}
          value={password}
          onChangeText={(t) => { setPassword(t); setError(""); }}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleEmailAuth}
          testID="password-input"
        />

        {/* Error */}
        {!!error && (
          <View style={[styles.errorBox, { backgroundColor: "#FEE2E2" }]}>
            <Feather name="alert-circle" size={14} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Info */}
        {!!info && (
          <View style={[styles.infoBox, { backgroundColor: "#D1FAE5" }]}>
            <Feather name="check-circle" size={14} color="#059669" />
            <Text style={styles.infoText}>{info}</Text>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primary, opacity: canSubmit ? 1 : 0.5 },
          ]}
          onPress={handleEmailAuth}
          disabled={!canSubmit}
          testID="auth-submit-btn"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>
          {mode === "signin"
            ? "New to Pariverse? Switch to Create Account above."
            : "Already have an account? Switch to Sign In above."}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 28 },
  logoArea: { alignItems: "center", gap: 10, marginBottom: 36 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 32 },
  appName: { fontSize: 30, fontFamily: "Inter_700Bold" },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular" },
  modeToggle: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  modeBtnActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 20,
    minHeight: 48,
  },
  googleLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  googleBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: { color: "#DC2626", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoText: { color: "#059669", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 15,
    borderRadius: 13,
    marginBottom: 16,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  footerNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});
