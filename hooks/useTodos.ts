import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export const useTodos = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("todos3")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTodos(data || []);
    }

    setIsLoading(false);
  }, [user?.id, supabase]);

  useEffect(() => {
    if (!user) return;
    loadTodos();
  }, [user, loadTodos]);

  /**
   * Add Todo
   */
  const addTodo = async (text: string) => {
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("todos3").insert({
      text,
      completed: false,
      user_id: user.id,
    });

    if (error) throw error;

    await loadTodos(); // 自动刷新
  };

  /**
   * Toggle Todo
   */
  const toggleTodo = async (id: string, completed: boolean) => {
    // 乐观更新
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo,
      ),
    );

    const { error } = await supabase
      .from("todos3")
      .update({ completed: !completed })
      .eq("id", id)
      .eq("user_id", user?.id); // 🔐 安全限制

    if (error) {
      await loadTodos(); // 回滚
      throw error;
    }
  };

  /**
   * Delete Todo
   */
  const deleteTodo = async (id: string) => {
    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const previous = todos;
          setTodos((prev) => prev.filter((todo) => todo.id !== id));

          const { error } = await supabase
            .from("todos3")
            .delete()
            .eq("id", id)
            .eq("user_id", user?.id); // 🔐 安全限制

          if (error) {
            // setTodos(previous); // 回滚
            loadTodos();
            throw error;
          }
        },
      },
    ]);
  };

  return {
    todos,
    isLoading,
    error,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};
