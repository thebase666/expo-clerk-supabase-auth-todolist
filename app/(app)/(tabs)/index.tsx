import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import React, { useCallback, useEffect, useState } from "react";
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

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function Todo2() {
  const { user } = useUser();
  const supabase = useSupabase();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * 拉取 todos
   */
  const fetchTodos = useCallback(
    async (isRefreshing = false) => {
      if (!user || !supabase) return;

      if (isRefreshing) setRefreshing(true);
      else setLoading(true);

      const { data, error } = await supabase
        .from("todos3")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load todos");
      } else {
        setTodos(data || []);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [user, supabase],
  );

  /**
   * 初始化加载
   */
  useEffect(() => {
    if (!user || !supabase) return;
    fetchTodos();
  }, [user, supabase]);

  /**
   * 新建 Todo
   */
  const addTodo = async () => {
    if (!input.trim()) return;
    if (!supabase) return;

    const text = input.trim();
    setInput("");

    const { error } = await supabase
      .from("todos3")
      .insert([{ text, completed: false, user_id: user?.id }]);

    if (error) {
      Alert.alert("Error", "Failed to add todo");
    } else {
      fetchTodos();
    }
  };

  /**
   * 切换状态
   */
  const toggleTodo = async (id: string, completed: boolean) => {
    if (!supabase) return;

    const { error } = await supabase
      .from("todos3")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", "Failed to update todo");
    } else {
      fetchTodos();
    }
  };

  /**
   * 删除 Todo
   */
  const deleteTodo = async (id: string) => {
    if (!supabase) return;

    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("todos3").delete().eq("id", id);

          if (error) {
            Alert.alert("Error", "Failed to delete todo");
          } else {
            fetchTodos();
          }
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={{ padding: 20 }}>
        <Text>Please sign in</Text>
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 20, flex: 1 }}>
      {/* 输入框 */}
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
          onPress={addTodo}
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

      {/* 列表 */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTodos(true)}
          />
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
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 0.5,
              borderColor: "#eee",
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
                  color: item.completed ? "#aaa" : "#000",
                }}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
