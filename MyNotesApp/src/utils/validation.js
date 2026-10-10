import * as Yup from "yup";

export const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Tiêu đề không được để trống")
    .max(100, "Tối đa 100 ký tự"),
  content: Yup.string()
    .trim()
    .required("Nội dung không được để trống")
    .max(5000, "Tối đa 5000 ký tự"),
});
