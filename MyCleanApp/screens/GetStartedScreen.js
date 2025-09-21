import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

export default function GetStartedScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Smart Learning Companion</Text>
          <Text style={styles.subtitle}>Boost your learning & productivity 🚀</Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)", // ✅ darker overlay
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: { 
    alignItems: "center", 
    width: "100%",
    maxWidth: 400,
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 18, 
    color: "#A9B2C3", 
    marginBottom: 30, 
    textAlign: "center",
  },
  button: { 
    backgroundColor: "#0A84FF", 
    paddingVertical: 14,      
    borderRadius: 12, 
    width: "100%",
    alignItems: "center",
    shadowColor: "#0A84FF", // ✅ glowing effect
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: { 
    color: "#FFFFFF", 
    fontSize: 18,             
    fontWeight: "bold",
  },
});
