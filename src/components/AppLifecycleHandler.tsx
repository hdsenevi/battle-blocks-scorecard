/**
 * App Lifecycle Handler Component
 * Wrapper component to use the app lifecycle hook
 * Must be inside GameProvider
 */

import { useEffect, useState } from "react";
import { ThemedView } from "./themed-view";
import { Text } from "react-native";
import { initializeDatabase, getDatabasePath } from "../services/database";
import { useAppLifecycle } from "../hooks/useAppLifecycle";

export function AppLifecycleHandler() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Use app lifecycle hook to handle save/restore
  // Hook will handle errors gracefully if database isn't ready
  useAppLifecycle();

  /**
   * Log database path for debugging (non-blocking, dev only)
   */
  const logDatabasePathSafely = async (): Promise<void> => {
    if (!__DEV__) return;
    
    try {
      const dbPath = await getDatabasePath();
      console.log("Database path:", dbPath);
    } catch (pathError) {
      console.warn("Could not retrieve database path:", pathError);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize database schema on app start
        await initializeDatabase();
        
        // Log database path (non-blocking, dev only)
        await logDatabasePathSafely();
        
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
      <ThemedView className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/80 z-[9999]">
        <Text className="text-red-500 text-lg font-semibold mb-2 text-center px-5">
          Database Error: {initError}
        </Text>
        <Text className="text-white text-sm text-center px-5">
          Please restart the app
        </Text>
      </ThemedView>
    );
  }

  // Show loading during initialization
  if (isInitializing) {
    return null; // Or show a loading indicator if desired
  }

  return null; // This component doesn't render anything after initialization
}
