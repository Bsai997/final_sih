import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Keyboard, ImageBackground, Platform, ScrollView, Animated 
} from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EducationalScreen() {
  const navigation = useNavigation();

  // --- State ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));
  const [taskType, setTaskType] = useState("video");
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [timeInput, setTimeInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [progressAnim] = useState(new Animated.Value(1));

  // --- Toggle Drawer ---
  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  // --- Extract YouTube ID ---
  const extractYouTubeID = (link) => {
    if (!link) return null;
    link = link.trim();
    if (/^([a-zA-Z0-9_-]{11})$/.test(link)) return link;
    try {
      const u = new URL(link);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) {
        if (u.searchParams.get("v")) return u.searchParams.get("v");
      }
    } catch {}
    return null;
  };

  const buildEmbedUrl = (id) => id ? `https://www.youtube.com/embed/${id}?rel=0&autoplay=1` : null;

  // --- PDF Upload ---
  const handlePdfUpload = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const urlObj = URL.createObjectURL(file);
          setUrl(urlObj);
        }
      };
      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (result.type === "success") setUrl(result.uri);
    }
  };

  // --- Parse HH:MM:SS ---
  const parseTime = (input) => {
    const parts = input.split(":").map((p) => parseInt(p, 10) || 0);
    const [h=0, m=0, s=0] = parts;
    return h*3600 + m*60 + s;
  };

  // --- Start Task ---
  const handleStart = () => {
    const total = parseTime(timeInput);
    if (!total || total <= 0) {
      alert("❌ Please enter valid time (HH:MM:SS)");
      return;
    }
    if (taskType === "video") {
      const id = extractYouTubeID(url);
      if (!id) {
        alert("❌ Invalid YouTube URL");
        return;
      }
      setVideoId(id);
    } else if (taskType === "pdf" && !url) {
      alert("❌ Please upload a PDF");
      return;
    }
    setRemainingTime(total);
    setIsRunning(true);
    Keyboard.dismiss();
  };

  // --- Countdown Timer ---
  useEffect(() => {
    if (!isRunning) return;
    if (remainingTime <= 0) {
      setIsRunning(false);
      Animated.timing(progressAnim, { toValue: 0, duration: 0, useNativeDriver: false }).start();
      alert("✅ Time Completed!");
      return;
    }
    Animated.timing(progressAnim, {
      toValue: remainingTime / parseTime(timeInput),
      duration: 500,
      useNativeDriver: false,
    }).start();
    const timer = setInterval(() => setRemainingTime(prev => prev-1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, remainingTime]);

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <ImageBackground source={require("../assets/back.jpg")} style={styles.bg} resizeMode="cover">
      
      {/* --- Navbar --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={{ padding: 10 }}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Educational</Text>
      </View>

      {/* --- Backdrop --- */}
      {menuOpen && (
        <TouchableOpacity style={styles.backdrop} onPress={toggleMenu} activeOpacity={1} />
      )}

      {/* --- Sliding Drawer --- */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Home"); }}>
          <Ionicons name="home" size={22} color="#0A84FF" />
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Profile"); }}>
          <Ionicons name="person" size={22} color="#fff" />
          <Text style={styles.drawerText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Tasks"); }}>
          <Ionicons name="list" size={22} color="#fff" />
          <Text style={styles.drawerText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Progress"); }}>
          <Ionicons name="bar-chart" size={22} color="#fff" />
          <Text style={styles.drawerText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Settings"); }}>
          <Ionicons name="settings" size={22} color="#fff" />
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleMenu(); navigation.navigate("Logout"); }}>
          <Ionicons name="log-out" size={22} color="#FF4C4C" />
          <Text style={[styles.drawerText, { color:"#FF4C4C" }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* --- Main Content --- */}
      {!isRunning ? (
        <ScrollView contentContainerStyle={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>📘 Educational Task</Text>

            {/* Task Type Picker */}
            <View style={styles.pickerBox}>
              <Text style={styles.label}>Select Task Type:</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={taskType} onValueChange={setTaskType} style={styles.picker}>
                  <Picker.Item label="🎥 Video" value="video" />
                  <Picker.Item label="📄 PDF" value="pdf" />
                </Picker>
              </View>
            </View>

            {/* Video URL or PDF Upload */}
            {taskType === "video" ? (
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>▶️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Paste YouTube URL"
                  placeholderTextColor="#bbb"
                  value={url}
                  onChangeText={setUrl}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBtn} onPress={handlePdfUpload}>
                <Text style={styles.inputIcon}>📄</Text>
                <Text style={styles.uploadText}>{url ? "PDF Selected ✅" : "Upload PDF"}</Text>
              </TouchableOpacity>
            )}

            {/* Timer Input */}
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM:SS"
              placeholderTextColor="#ddd"
              value={timeInput}
              onChangeText={setTimeInput}
              keyboardType="numbers-and-punctuation"
            />

            {/* Start Button */}
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Start Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.taskContainer}>
          {/* Video / PDF */}
          {taskType === "video" ? (
            Platform.OS === "web" ? (
              <iframe
                width="100%"
                height="100%"
                src={buildEmbedUrl(videoId)}
                title="YouTube Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <WebView
                source={{ uri: buildEmbedUrl(videoId) }}
                style={{ flex: 1 }}
                allowsFullscreenVideo
              />
            )
          ) : (
            Platform.OS === "web" ? (
              <iframe width="100%" height="100%" src={url} title="PDF" />
            ) : (
              <WebView source={{ uri: url }} style={{ flex: 1 }} />
            )
          )}

          {/* Timer & Progress */}
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange:[0,1], outputRange:["0%","100%"] }) }]}
                           />
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "rgba(27,38,59,0.9)" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15 },

  overlay: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.6)" },
  card: { width: "100%", maxWidth: 500, backgroundColor: "rgba(27, 38, 59, 0.9)", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  pickerBox: { marginVertical: 12 },
  pickerWrapper: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  picker: { color: "#121111ff", fontSize: 16, height: 50 },
  label: { color: "#f1ededff", marginBottom: 6, fontSize: 16, fontWeight: "500" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(236, 230, 230, 0.1)", borderRadius: 10, paddingHorizontal: 10, marginVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  inputIcon: { fontSize: 20, marginRight: 8, color: "#ef5d5dff" },
  input: { flex: 1, color: "#c9c5c5ff", padding: 12, fontSize: 16 },
  uploadBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 14, borderRadius: 10, backgroundColor: "#0A84FF", marginVertical: 12, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  uploadText: { color: "#fefbfbff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  timeInput: { backgroundColor: "#4c5670", color: "#fff", borderRadius: 8, padding: 12, marginVertical: 10, fontSize: 16, textAlign: "center" },
  button: { backgroundColor: "#0A84FF", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  taskContainer: { flex: 1 },
  timerBox: { padding: 20, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center" },
  timerText: { fontSize: 36, fontWeight: "bold", color: "#0AFFFF", textShadowColor: "#0AFFFF", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10, letterSpacing: 2, marginBottom: 12 },
  progressBackground: { width: "80%", height: 8, backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#0AFFFF", borderRadius: 4 },
  header: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "rgba(0,0,0,0.6)" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  drawer: { position: "absolute", top: 0, bottom: 0, width: 250, backgroundColor: "#1B263B", paddingTop: 60, zIndex: 1000 },
  drawerItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 0.5, borderBottomColor: "#fff" },
  drawerText: { color: "#fff", fontSize: 16, marginLeft: 10 },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 500 },
});

