import { useTodos } from "@/hooks/useTodos";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Todo3() {
  // const { user } = useUser();
  const {
    todos,
    isLoading,
    error,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const [input, setInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return;

    try {
      await addTodo(input.trim());
      setInput("");
    } catch (err) {
      Alert.alert("Error", "Failed to add todo");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 20, flex: 1 }}>
      <Text> Expo Supabase Hook & Optimistic Updates </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
            marginRight: 10,
          }}
        />
        <TouchableOpacity
          onPress={handleAdd}
          style={{
            backgroundColor: "#007AFF",
            paddingHorizontal: 20,
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ marginTop: 50, alignItems: "center" }}>
            <Text style={{ color: "#999" }}>No tasks yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => toggleTodo(item.id, item.completed)}
            >
              <Text
                style={{
                  fontSize: 16,
                  textDecorationLine: item.completed ? "line-through" : "none",
                  color: item.completed ? "#999" : "#000",
                }}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={{ marginLeft: 15 }}
            >
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
