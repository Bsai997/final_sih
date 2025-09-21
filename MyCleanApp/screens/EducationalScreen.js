import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ImageBackground,
} from "react-native";
import { WebView } from "react-native-webview";

export default function EducationalScreen() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  // --- YouTube helpers (same as before) ---
  const extractYouTubeID = (url) => {
    if (!url || typeof url !== "string") return null;
    url = url.trim();

    if (/^([a-zA-Z0-9_-]{11})$/.test(url)) return url;

    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (host === "youtu.be") {
        return u.pathname.slice(1).split(/[^0-9A-Za-z_-]/)[0];
      }
      if (host.endsWith("youtube.com")) {
        if (u.searchParams.get("v"))
          return u.searchParams.get("v").split(/[^0-9A-Za-z_-]/)[0];
        const paths = u.pathname.split("/").filter(Boolean);
        const possible = paths[paths.length - 1];
        if (possible && possible.length >= 6)
          return possible.split(/[^0-9A-Za-z_-]/)[0];
      }
    } catch (e) {}

    const rx = /([a-zA-Z0-9_-]{11})/g;
    const m = url.match(rx);
    return m ? m[0] : null;
  };

  const buildEmbedUrl = (videoId) => {
    if (!videoId) return null;
    const params = new URLSearchParams();
    params.set("rel", "0");
    params.set("modestbranding", "1");
    params.set("enablejsapi", "1");
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handlePlay = () => {
    const id = extractYouTubeID(url);
    if (!id) {
      alert("❌ Please enter a valid YouTube URL or video ID.");
      return;
    }
    setVideoId(id);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setUrl("");
    setVideoId(null);
  };

  return (
    <ImageBackground
      source={require("../assets/back.jpg")} // 👈 put your image in /assets folder
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Start Your Task</Text>

          {/* Input + Button */}
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Paste YouTube URL here"
              placeholderTextColor="#fffdfdff"
              value={url}
              onChangeText={setUrl}
              onSubmitEditing={handlePlay}
            />
            <TouchableOpacity style={styles.button} onPress={handlePlay}>
              <Text style={styles.buttonText}>Load & Play</Text>
            </TouchableOpacity>
          </View>

          {/* Clear Button */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#0A84FF" }]}
              onPress={handleClear}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Player */}
          <View style={styles.player}>
            {videoId ? (
              <WebView
                source={{ uri: buildEmbedUrl(videoId) }}
                style={{ flex: 1 }}
                allowsFullscreenVideo
              />
            ) : (
              <View style={styles.noVideo}>
                <Text style={{ color: "#aaa" }}>No video loaded</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark overlay for readability
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "rgba(27, 38, 59, 0.9)",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f3eeeeff",
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#18191aff",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#4c5670ff",
    color: "#000",
  },
  inputText: {
    color: "#b19191ff",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#0A84FF",
  },
  buttonText: {
    color: "#eff2f4ff",
    fontWeight: "600",
  },
  controls: {
    marginBottom: 16,
    alignItems: "flex-end",
  },
  player: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  noVideo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
