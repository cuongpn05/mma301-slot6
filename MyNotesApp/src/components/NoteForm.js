import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import { NoteSchema } from "../utils/validation";

export default function NoteForm({
  initialValues,
  onSubmit,
  submitButtonLabel = "Lưu",
  onValuesChange,
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      validateOnMount
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
      }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Tiêu đề</Text>
          <TextInput
            style={[
              styles.input,
              touched.title && errors.title ? styles.inputError : null,
            ]}
            placeholder="Nhập tiêu đề ghi chú..."
            value={values.title}
            onChangeText={(text) => {
              handleChange("title")(text);
              onValuesChange?.({ ...values, title: text });
            }}
            onBlur={handleBlur("title")}
          />
          {touched.title && errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}

          <Text style={styles.label}>Nội dung</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              touched.content && errors.content ? styles.inputError : null,
            ]}
            placeholder="Nhập nội dung ghi chú..."
            value={values.content}
            onChangeText={(text) => {
              handleChange("content")(text);
              onValuesChange?.({ ...values, content: text });
            }}
            onBlur={handleBlur("content")}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {touched.content && errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!isValid || isSubmitting) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{submitButtonLabel}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: { height: 120 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 13 },
  button: {
    marginTop: 16,
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#99c2ff" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
