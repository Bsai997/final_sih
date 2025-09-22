import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

export default function EducationalScreen() {
  const [taskType, setTaskType] = useState("video"); // "video" or "pdf"
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [timeInput, setTimeInput] = useState("00:00:00");

  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // ✅ Extract YouTube ID
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

  const buildEmbedUrl = (id) =>
    id ? `https://www.youtube.com/embed/${id}?rel=0&autoplay=1` : null;

  // ✅ Pick PDF (Web & Mobile)
  const handlePdfUpload = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const urlObj = URL.createObjectURL(file); // blob URL
          setUrl(urlObj);
        }
      };
      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") {
        setUrl(result.uri);
      }
    }
  };

  // ✅ Parse HH:MM:SS
  const parseTime = (input) => {
    const parts = input.split(":").map((p) => parseInt(p, 10) || 0);
    const [h = 0, m = 0, s = 0] = parts;
    return h * 3600 + m * 60 + s;
  };

  // ✅ Start Task
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

  // ✅ Countdown
  useEffect(() => {
    if (!isRunning) return;
    if (remainingTime <= 0) {
      setIsRunning(false);
      alert("✅ Task Completed!");
      return;
    }
    const timer = setInterval(
      () => setRemainingTime((prev) => prev - 1),
      1000
    );
    return () => clearInterval(timer);
  }, [isRunning, remainingTime]);

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>📘 Educational Task</Text>

          {/* Select Task Type */}
          {!isRunning && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Select Task Type:</Text>
              <Picker
                selectedValue={taskType}
                style={styles.picker}
                onValueChange={(v) => setTaskType(v)}
              >
                <Picker.Item label="Video" value="video" />
                <Picker.Item label="PDF" value="pdf" />
              </Picker>
            </View>
          )}

          {/* Video Input / PDF Upload */}
          {!isRunning &&
            (taskType === "video" ? (
              <TextInput
                style={styles.input}
                placeholder="Paste YouTube URL"
                placeholderTextColor="#ddd"
                value={url}
                onChangeText={setUrl}
              />
            ) : (
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handlePdfUpload}
              >
                <Text style={styles.buttonText}>
                  {url ? "📄 PDF Selected ✅" : "Upload PDF"}
                </Text>
              </TouchableOpacity>
            ))}

          {/* Timer Input */}
          {!isRunning && (
            <View style={styles.timeRow}>
              <TextInput
                style={styles.timeInput}
                placeholder="HH:MM:SS"
                placeholderTextColor="#ddd"
                value={timeInput}
                onChangeText={setTimeInput}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          )}

          {/* Start Button */}
          {!isRunning && (
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Start Task</Text>
            </TouchableOpacity>
          )}

          {/* Task + Timer */}
          {isRunning && (
            <View style={styles.taskRow}>
              <View style={styles.taskBox}>
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
                ) : Platform.OS === "web" ? (
                  <iframe width="100%" height="100%" src={url} title="PDF" />
                ) : (
                  <WebView source={{ uri: url }} style={{ flex: 1 }} />
                )}
              </View>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "rgba(27,38,59,0.9)",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: { marginVertical: 10 },
  label: { color: "#fff", marginBottom: 4 },
  picker: { backgroundColor: "#4c5670", color: "#fff" },
  input: {
    backgroundColor: "#4c5670",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  uploadBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#0A84FF",
    marginVertical: 10,
    alignItems: "center",
  },
  timeRow: {
    justifyContent: "center",
    marginVertical: 10,
  },
  timeInput: {
    width: 150,
    backgroundColor: "#4c5670",
    color: "#fff",
    textAlign: "center",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#0A84FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  taskRow: { flexDirection: "row", marginTop: 16, gap: 10 },
  taskBox: {
    flex: 3,
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  timerBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  timerText: { fontSize: 26, fontWeight: "bold", color: "#0AFFFF" },
});
