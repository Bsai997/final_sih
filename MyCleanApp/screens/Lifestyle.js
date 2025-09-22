import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function LifestyleScreen({ navigation }) {
  const habits = [
    { id: 1, name: "🏋️ Gym" },
    { id: 2, name: "📖 Book Reading" },
    { id: 3, name: "🚶 Morning Walk" },
    { id: 4, name: "🧘 Yoga" },
    { id: 5, name: "🥗 Healthy Eating" },
    { id: 6, name: "💧 Drinking Water" },
    { id: 7, name: "🛏️ Sleep Early" },
  ];

  const handleHabitPress = (habit) => {
    alert(`You selected: ${habit.name}`);
    // 👉 Later you can navigate to a details page for each habit if needed
    // navigation.navigate("HabitDetails", { habit })
  };

  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌿 Choose Your Lifestyle Habit</Text>

        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={styles.habitButton}
            onPress={() => handleHabitPress(habit)}
          >
            <Text style={styles.habitText}>{habit.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  habitButton: {
    backgroundColor: "#0A84FF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  habitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
