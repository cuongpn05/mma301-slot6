// Lọc ghi chú theo nội dung tìm kiếm
export const filterNotesBySearch = (notes, searchText) => {
  if (!searchText || searchText.trim() === "") {
    return notes;
  }

  const lower = searchText.toLowerCase();

  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lower) ||
      note.content.toLowerCase().includes(lower),
  );
};

// Sắp xếp note mới cập nhật lên đầu
export const sortNotesByUpdatedAt = (notes) => {
  return [...notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
};
