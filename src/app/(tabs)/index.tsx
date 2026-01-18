/**
 * Home Screen
 * Main entry point for the app
 */

import { StyleSheet, View, TouchableOpacity, Platform, Text } from "react-native";
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
          <Text className="text-base">Loading...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Text className="text-3xl font-bold mb-4 text-center">
          Battle Blocks Scorecard
        </Text>

        <Text className="text-base mb-10 text-center opacity-70">
          Track scores for your Battle Blocks games
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartNewGame}
            accessibilityLabel="Start New Game"
            accessibilityRole="button"
            testID="start-new-game-button"
          >
            <Text className="text-white text-base font-semibold">Start New Game</Text>
          </TouchableOpacity>

          {hasActiveGames && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleContinueGame}
              testID="continue-game-button"
              accessibilityLabel="Continue Game"
              accessibilityRole="button"
            >
              <Text className="text-primary text-base font-semibold">
                Continue Game
              </Text>
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
});
