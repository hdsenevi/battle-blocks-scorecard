/**
 * App Lifecycle Handler Component
 * Wrapper component to use the app lifecycle hook
 * Must be inside GameProvider
 */

import { useEffect, useState } from "react";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { StyleSheet } from "react-native";
import { initializeDatabase } from "../services/database";
import { useAppLifecycle } from "../hooks/useAppLifecycle";

export function AppLifecycleHandler() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Use app lifecycle hook to handle save/restore
  // Hook will handle errors gracefully if database isn't ready
  useAppLifecycle();

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize database schema on app start
        await initializeDatabase();
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setInitError(
          error instanceof Error ? error.message : "Unknown error"
        );
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Show error if initialization failed
  if (initError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Database Error: {initError}
        </ThemedText>
        <ThemedText style={styles.errorSubtext}>
          Please restart the app
        </ThemedText>
      </ThemedView>
    );
  }

  // Show loading during initialization
  if (isInitializing) {
    return null; // Or show a loading indicator if desired
  }

  return null; // This component doesn't render anything after initialization
}

const styles = StyleSheet.create({
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9999,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  errorSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
