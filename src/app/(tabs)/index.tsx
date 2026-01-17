/**
 * Home Screen
 * Main entry point for the app
 */

import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { useGameState, useGameDispatch } from "@/contexts/GameContext";
import { useEffect, useState } from "react";
import {
  listActiveGames,
  listPausedGames,
  getGame,
  getPlayersByGame,
  updateGame,
} from "@/services/database";
import { resumeGameAction } from "@/reducers/actionCreators";

export default function HomeScreen() {
  const router = useRouter();
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [hasActiveGames, setHasActiveGames] = useState(false);

  // Check for active or paused games to show Continue Game button, but don't auto-navigate
  useEffect(() => {
    const checkForActiveGames = async () => {
      try {
        // If game already loaded in context, show continue button
        if (gameState.currentGame && (gameState.gameStatus === "active" || gameState.gameStatus === "paused")) {
          setHasActiveGames(true);
          setIsChecking(false);
          return;
        }

        // Check for active or paused games in database
        const activeGames = await listActiveGames();
        const pausedGames = await listPausedGames();
        setHasActiveGames(activeGames.length > 0 || pausedGames.length > 0);
      } catch (error) {
        console.error("Failed to check for active games:", error);
        setHasActiveGames(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkForActiveGames();
  }, [gameState.currentGame, gameState.gameStatus]);

  const handleStartNewGame = () => {
    router.push("/game/new");
  };

  const handleContinueGame = async () => {
    if (gameState.currentGame && (gameState.gameStatus === "active" || gameState.gameStatus === "paused")) {
      // If game already in context, navigate directly
      // If paused, make it active first
      if (gameState.gameStatus === "paused") {
        await updateGame(gameState.currentGame.id, { status: "active" });
      }
      router.push(`/game/${gameState.currentGame.id}`);
      return;
    }

    // Check for active or paused games
    try {
      const activeGames = await listActiveGames();
      const pausedGames = await listPausedGames();
      const allResumableGames = [...activeGames, ...pausedGames];
      
      if (allResumableGames.length === 1) {
        // Single game - resume directly
        const game = await getGame(allResumableGames[0].id);
        if (game) {
          // If paused, make it active
          if (game.status === "paused") {
            await updateGame(game.id, { status: "active" });
            const updatedGame = await getGame(game.id);
            if (updatedGame) {
              const players = await getPlayersByGame(updatedGame.id);
              dispatch(resumeGameAction(updatedGame, players));
              router.push(`/game/${updatedGame.id}`);
            }
          } else {
            const players = await getPlayersByGame(game.id);
            dispatch(resumeGameAction(game, players));
            router.push(`/game/${game.id}`);
          }
        }
      } else if (allResumableGames.length > 1) {
        // Multiple games - show selection screen
        router.push("/game/select");
      }
    } catch (error) {
      console.error("Failed to check for active games:", error);
    }
  };

  if (isChecking) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Battle Blocks Scorecard
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Track scores for your Battle Blocks games
        </ThemedText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartNewGame}
            accessibilityLabel="Start New Game"
            accessibilityRole="button"
          >
            <ThemedText style={styles.buttonText}>Start New Game</ThemedText>
          </TouchableOpacity>

          {hasActiveGames && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleContinueGame}
              accessibilityLabel="Continue Game"
              accessibilityRole="button"
            >
              <ThemedText style={styles.secondaryButtonText}>
                Continue Game
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
  },
  button: {
    paddingVertical: Platform.select({ ios: 16, android: 18, default: 16 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
