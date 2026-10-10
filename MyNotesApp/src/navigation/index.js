import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AddNoteScreen from "../screens/AddNoteScreen";
import EditNoteScreen from "../screens/EditNoteScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MyNotesApp" }} />
        <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: "Thêm ghi chú" }} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: "Chỉnh sửa ghi chú" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
