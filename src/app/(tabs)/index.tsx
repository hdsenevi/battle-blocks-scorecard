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
import { listActiveGames, getGame, getPlayersByGame } from "@/services/database";
import { resumeGameAction } from "@/reducers/actionCreators";

export default function HomeScreen() {
  const router = useRouter();
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [isChecking, setIsChecking] = useState(true);

  // Story 2.4: Resume interrupted game on app start
  useEffect(() => {
    const checkForActiveGame = async () => {
      try {
        // If game already loaded in context, use it
        if (gameState.currentGame && gameState.gameStatus === "active") {
          router.replace(`/game/${gameState.currentGame.id}`);
          return;
        }

        // Check for active games in database
        const activeGames = await listActiveGames();
        if (activeGames.length > 0) {
          // Use most recent active game
          const game = await getGame(activeGames[0].id);
          if (game) {
            const players = await getPlayersByGame(game.id);
            dispatch(resumeGameAction(game, players));
            router.replace(`/game/${game.id}`);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check for active game:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkForActiveGame();
  }, [dispatch, router, gameState.currentGame, gameState.gameStatus]);

  const handleStartNewGame = () => {
    router.push("/game/new");
  };

  const handleContinueGame = () => {
    if (gameState.currentGame) {
      router.push(`/game/${gameState.currentGame.id}`);
    }
  };

  const hasActiveGame = gameState.currentGame && gameState.gameStatus === "active";

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

          {hasActiveGame && (
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
