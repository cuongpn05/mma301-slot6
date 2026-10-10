import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function NoteItem({ note, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title} numberOfLines={1}>
        {note.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {note.content}
      </Text>
      <Text style={styles.time}>
        Cập nhật: {new Date(note.updatedAt).toLocaleString("vi-VN")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});
