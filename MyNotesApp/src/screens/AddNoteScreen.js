import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as Crypto from "expo-crypto";
import NoteForm from "../components/NoteForm";
import { loadNotes, saveNotes } from "../storage/notes";

export default function AddNoteScreen({ navigation }) {
  const handleSubmit = async (values) => {
    try {
      const notes = await loadNotes();
      const now = new Date().toISOString();
      const newNote = {
        id: Crypto.randomUUID(),
        title: values.title.trim(),
        content: values.content.trim(),
        createdAt: now,
        updatedAt: now,
      };

      await saveNotes([newNote, ...notes]);
      Alert.alert("Thành công", "Đã tạo ghi chú mới!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding note", error);
      Alert.alert("Lỗi", "Không thể tạo ghi chú. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <NoteForm
        initialValues={{ title: "", content: "" }}
        onSubmit={handleSubmit}
        submitButtonLabel="Tạo ghi chú"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f4f5" },
});
