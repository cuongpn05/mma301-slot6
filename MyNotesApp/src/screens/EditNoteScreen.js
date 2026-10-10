import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import NoteForm from "../components/NoteForm";
import { loadNotes, saveNotes } from "../storage/notes";

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialValues = useMemo(
    () => ({ title: note.title, content: note.content }),
    [note.content, note.title],
  );

  const handleSubmit = async (values) => {
    try {
      const notes = await loadNotes();
      const updatedNotes = notes.map((item) =>
        item.id === note.id
          ? {
              ...item,
              title: values.title.trim(),
              content: values.content.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      );
      await saveNotes(updatedNotes);
      setHasUnsavedChanges(false);
      Alert.alert("Thành công", "Đã cập nhật ghi chú!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating note", error);
      Alert.alert("Lỗi", "Không thể cập nhật ghi chú. Vui lòng thử lại.");
    }
  };

  const handleDelete = useCallback(() => {
    Alert.alert("Xóa ghi chú", "Bạn có chắc chắn muốn xóa ghi chú này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const notes = await loadNotes();
            await saveNotes(notes.filter((item) => item.id !== note.id));
            setHasUnsavedChanges(false);
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting note", error);
            Alert.alert("Lỗi", "Không thể xóa ghi chú.");
          }
        },
      },
    ]);
  }, [navigation, note.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chỉnh sửa ghi chú",
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleDelete]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      Alert.alert(
        "Chưa lưu thay đổi",
        "Bạn có chắc chắn muốn thoát mà không lưu?",
        [
          { text: "Ở lại", style: "cancel" },
          {
            text: "Thoát",
            style: "destructive",
            onPress: () => navigation.dispatch(event.data.action),
          },
        ],
      );
    });
    return unsubscribe;
  }, [hasUnsavedChanges, navigation]);

  const trackChanges = (values) => {
    setHasUnsavedChanges(
      values.title !== initialValues.title || values.content !== initialValues.content,
    );
  };

  return (
    <View style={styles.container}>
      <NoteForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonLabel="Lưu thay đổi"
        onValuesChange={trackChanges}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f4f5" },
  deleteButton: { marginRight: 8 },
  deleteText: { color: "#d9363e", fontWeight: "600" },
});
