import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarWrapper}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={28} color="#fff" />
            )}
          </View>

          <Text style={styles.name}>{user?.firstName || "User"}</Text>
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#2563eb" />
            <Text style={styles.menuText}>Account Settings</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#2563eb"
            />
            <Text style={styles.menuText}>Security</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7ff",
  },

  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 28,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e3a8a",
  },

  email: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 10,
    marginBottom: 30,
    shadowColor: "#2563eb",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginLeft: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 20,
  },

  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4444",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
