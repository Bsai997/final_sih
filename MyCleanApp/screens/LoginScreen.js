import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

// ✅ Use your actual laptop IPv4 address
const API_URL = "http://192.168.1.11:5000/api/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      Alert.alert(
        "Success",
        response.data.msg || response.data.message || "Login successful!"
      );
      const { user } = response.data;
      navigation.navigate("Home", { username: user.name });
    } catch (error) {
      console.error("Login error:", error.message);

      const errMsg = error.response?.data?.msg || error.response?.data?.message;

      if (error.response?.status === 400 && errMsg === "Invalid credentials") {
        setErrorMessage(
          error.response?.data?.message || "Invalid email or password"
        );
        setErrorPopup(true);

        // Auto close popup after 3 seconds
        setTimeout(() => setErrorPopup(false), 3000);
      } else {
        Alert.alert("Error", errMsg || "Login failed");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* 🔴 Error Popup */}
          {errorPopup && (
            <View style={styles.errorPopup}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#555" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#555" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>
              Don’t have an account?{" "}
              <Text style={styles.linkHighlight}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#908d8cff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  errorPopup: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1C1C1C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a5a0a0ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#2b2a2aff",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#faf6f6ff",
  },
  button: {
    backgroundColor: "#3f3e3eff",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    marginTop: 18,
    fontSize: 14,
    color: "#555",
  },
  linkHighlight: {
    color: "#333",
    fontWeight: "bold",
  },
});
