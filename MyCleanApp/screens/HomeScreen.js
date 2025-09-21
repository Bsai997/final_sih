import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from "react-native";
export default function HomeScreen({ route, navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const slideAnim = useState(new Animated.Value(-250))[0]; // sliding drawer

  // ✅ get username from params
  const { username } = route.params || {};

  const motivationalQuotes = [
    "Start today with focus, and end it with progress.",
    "Small steps every day lead to big achievements.",
    "Consistency is the key to success.",
    "A focused mind makes you proud.",
  ];

  // Cycle motivational quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={28} color="#fdf8f8ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        {menuOpen && (
          <TouchableOpacity
            style={styles.backdrop}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        )}

        {/* Sliding Drawer */}
        <Animated.View style={[styles.drawer, { left: slideAnim }]}>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="home" size={22} color="#0A84FF" />
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="person" size={22} color="#fff" />
            <Text style={styles.drawerText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="list" size={22} color="#fff" />
            <Text style={styles.drawerText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="bar-chart" size={22} color="#fff" />
            <Text style={styles.drawerText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="settings" size={22} color="#fff" />
            <Text style={styles.drawerText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleMenu}>
            <Ionicons name="log-out" size={22} color="#FF4C4C" />
            <Text style={[styles.drawerText, { color: "#FF4C4C" }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <ScrollView style={styles.main}>
          {/* ✅ Greeting with username */}
          <Text style={styles.greeting}>
            Hello {username ? username : "User"} 👋
          </Text>
          <Text style={styles.subtitle}>Ready to boost your learning today?</Text>

          {/* Moving Motivational Quotes */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{motivationalQuotes[quoteIndex]}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
             <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            ><Ionicons name="time" size={22} color="#1E90FF" />
              <Text style={styles.statValue}>2h 15m</Text>
              <Text style={styles.statLabel}>Focus Today</Text></Pressable>
           <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            > <Ionicons name="trophy" size={22} color="#FFD700" />
              <Text style={styles.statValue}>#9</Text>
              <Text style={styles.statLabel}>Leaderboard</Text></Pressable>
           <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            >  <Ionicons name="bar-chart" size={22} color="#1fe3f1ff" />
              <Text style={styles.statValue}>70%</Text>
              <Text style={styles.statLabel}>Progress</Text></Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            > <Ionicons name="flame" size={24} color="#e61a1aff" />
              <Text style={styles.statValue}>2-Days</Text>
              <Text style={styles.statLabel}>Daily streak</Text></Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            ><Ionicons name="checkmark-circle-outline" size={30} color="#2fde55ff" />
              <Text style={styles.statValue}>1-Tasks</Text>
              <Text style={styles.statLabel}>Completed</Text> </Pressable>
              
           
            <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            > <Ionicons name="star" size={30} color="#FF69B4" />
              <Text style={styles.statValue}>5-badges </Text>
              <Text style={styles.statLabel}>Daily Challenges </Text>
            </Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            >  <MaterialCommunityIcons name="bird" size={30} color="#b0e818ff" />
              <Text style={styles.statValue}>1-Bird</Text>
              <Text style={styles.statLabel}>Alive</Text></Pressable>
            <Pressable
              style={({ hovered }) => [
                styles.statCard,
                hovered && styles.statCardHover,
              ]}
              onPress={() => console.log("Bird Alive clicked")}
            >  <Ionicons name="people" size={30} color="#FF7F50" />
              <Text style={styles.statValue}>#1</Text>
              <Text style={styles.statLabel}>online challenges</Text></Pressable>
          </View>

          {/* Add Task Section */}
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>Add a Task</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text style={styles.addButtonText}>New Task</Text>
            </TouchableOpacity>
          </View>

          {/* Task Type Modal */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose Task Type</Text>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setModalVisible(false);
                 navigation.navigate('EducationalScreen');
                  }}
                >
                  <Ionicons name="book-outline" size={20} color="#fff" />
                  <Text style={styles.optionText}>Educational</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: "#f77f00" }]}
                  onPress={() => {
                    setModalVisible(false);
                    console.log("Uneducational Task Selected");
                  }}
                >
                  <Ionicons name="happy-outline" size={20} color="#fff" />
                  <Text style={styles.optionText}>Uneducational</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)" },

  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "rgba(27,38,59,0.9)" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15 },

  drawer: { position: "absolute", top: 0, bottom: 0, width: 250, backgroundColor: "#1B263B", paddingTop: 60, paddingHorizontal: 20, zIndex: 200 },
  drawerItem: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  drawerText: { color: "#fff", fontSize: 16, marginLeft: 10 },

  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 150 },

  main: { flex: 1, padding: 20 },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#A9B2C3", marginBottom: 20 },

  quoteCard: { backgroundColor: "#ebe7e7ff", borderRadius: 15, padding: 20, marginBottom: 20 },
  quoteText: { fontSize: 16, fontStyle: "italic", color: "#1B263B" },

  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20, },
  statCard: { backgroundColor: "rgba(30,42,71,0.9)", margin: 5, borderRadius: 12, padding: 15, alignItems: "center", width: "23%" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF", marginTop: 5 },
  statLabel: { fontSize: 12, color: "#A9B2C3" },


  badgeRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  badge: { alignItems: "center" },
  badgeText: { color: "#fff", marginTop: 5 },

  taskCard: { backgroundColor: "rgba(30,42,71,0.9)", borderRadius: 15, padding: 20, marginBottom: 50, paddingBottom: 30 ,height:150,marginTop:1},
  taskTitle: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF", marginBottom: 10 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#0A84FF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10,paddingBottom:8,marginBottom:30,justifyContent:"center" },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8, },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#1E2A47", borderRadius: 15, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  optionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1f72c5ff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginVertical: 8, width: "100%", justifyContent: "center" },
  optionText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  closeButton: { marginTop: 10 },
  closeButtonText: { color: "#0A84FF", fontSize: 16, fontWeight: "bold" },
});
