import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const onRegister = () => {
    // TODO: call your backend register endpoint here
    // If success:
    router.replace("/"); // or router.replace("/(auth)/login") if you want them to login after
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.outer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Register your{"\n"}account</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={COLORS.muted} />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={COLORS.muted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="key-outline" size={18} color={COLORS.muted} />
              <TextInput
                value={pw}
                onChangeText={setPw}
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                secureTextEntry={!showPw}
              />
              <Pressable
                onPress={() => setShowPw((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPw ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="key-outline" size={18} color={COLORS.muted} />
              <TextInput
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                secureTextEntry={!showConfirmPw}
              />
              <Pressable
                onPress={() => setShowConfirmPw((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showConfirmPw ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            <Pressable style={styles.primaryBtn} onPress={onRegister}>
              <Text style={styles.primaryBtnText}>Register</Text>
            </Pressable>

            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Link href="/(auth)/login" style={styles.footerLink}>
                Login
              </Link>
            </Text>
          </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  pageBg: "#1f1f1f",
  frameBg: "#f6e8dc",
  cardBg: "#4b0000",
  inputBg: "#ffffff",
  placeholder: "#411900",
  muted: "#411900",
  button: "#e2942c",
  textOnDark: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.frameBg,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  outer: {
    width: "100%",
    maxWidth: 380,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
    alignSelf: "center",
    width: "92%",
  },
  cardTitle: {
    color: COLORS.textOnDark,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  inputWrap: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: "#411900",
    fontSize: 16,
  },
  eyeBtn: {
    paddingLeft: 6,
  },
  primaryBtn: {
    backgroundColor: COLORS.button,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 18,
  },
  footerText: {
    color: "#f1dfd6",
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
  },
  footerLink: {
    color: "#ffffff",
    textDecorationLine: "underline",
    fontWeight: "700",
  },
});


// Make restrictions for login
// Make entire background white 