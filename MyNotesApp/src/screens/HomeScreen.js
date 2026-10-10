import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { loadNotes, saveNotes } from "../storage/notes";
import NoteItem from "../components/NoteItem";
import { filterNotesBySearch, sortNotesByUpdatedAt } from "../utils/helpers";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(async () => {
    try {
      setNotes(sortNotesByUpdatedAt(await loadNotes()));
    } catch (error) {
      console.error("Error loading notes", error);
      Alert.alert("Lỗi", "Không thể tải danh sách ghi chú.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleClearAll = () => {
    Alert.alert("Xóa tất cả", "Bạn có chắc chắn muốn xóa toàn bộ ghi chú?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await saveNotes([]);
            setNotes([]);
          } catch (error) {
            console.error("Error clearing notes", error);
            Alert.alert("Lỗi", "Không thể xóa ghi chú.");
          }
        },
      },
    ]);
  };

  const filteredNotes = filterNotesBySearch(notes, searchText);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyNotesApp</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddNote")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm ghi chú..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem note={item} onPress={() => navigation.navigate("EditNote", { note: item })} />
        )}
        contentContainerStyle={filteredNotes.length ? styles.listContent : styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có ghi chú phù hợp.</Text>}
      />
      {notes.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.clearButtonText}>Xóa tất cả ghi chú</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f5", paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  addButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#0066cc", alignItems: "center", justifyContent: "center" },
  addButtonText: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: -2 },
  searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16, backgroundColor: "#fff", marginBottom: 10 },
  listContent: { paddingBottom: 80 },
  emptyContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyText: { fontSize: 16, color: "#666" },
  clearButton: { position: "absolute", bottom: 16, left: 16, right: 16, paddingVertical: 10, borderRadius: 6, backgroundColor: "#d9363e", alignItems: "center" },
  clearButtonText: { color: "#fff", fontWeight: "600" },
});
