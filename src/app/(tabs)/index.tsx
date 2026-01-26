/**
 * Home Screen
 * Main entry point for the app
 */

import { View, TouchableOpacity, Platform, Text } from "react-native";
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
    // Story 5.3: Prevent resume for completed games (AC: 7)
    if (gameState.currentGame && gameState.gameStatus === "completed") {
      // Navigate to winner screen instead of game screen
      router.push(`/game/${gameState.currentGame.id}/winner`);
      return;
    }

    if (gameState.currentGame && (gameState.gameStatus === "active" || gameState.gameStatus === "paused")) {
      // If game already in context, navigate directly
      // If paused, make it active first
      if (gameState.gameStatus === "paused") {
        await updateGame(gameState.currentGame.id, { status: "active" });
      }
      router.push(`/game/${gameState.currentGame.id}`);
      return;
    }

    // Check for active or paused games (exclude completed games)
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
      <ThemedView className="flex-1">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-base">Loading...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Battle Blocks Scorecard
        </Text>

        <Text className="text-base mb-10 text-center opacity-70 text-gray-900 dark:text-gray-300">
          Track scores for your Battle Blocks games
        </Text>

        <View className="w-full max-w-[300px] gap-4">
          <TouchableOpacity
            className={`${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center justify-center bg-primary dark:bg-blue-500`}
            onPress={handleStartNewGame}
            accessibilityLabel="Start New Game"
            accessibilityRole="button"
            testID="start-new-game-button"
          >
            <Text className="text-white text-base font-semibold">Start New Game</Text>
          </TouchableOpacity>

          {hasActiveGames && (
            <TouchableOpacity
              className={`${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center justify-center bg-transparent border border-primary dark:border-blue-400`}
              onPress={handleContinueGame}
              testID="continue-game-button"
              accessibilityLabel="Continue Game"
              accessibilityRole="button"
            >
              <Text className="text-primary dark:text-blue-400 text-base font-semibold">
                Continue Game
              </Text>
            </TouchableOpacity>
          )}

          {/* Story 6.5: Privacy Policy Link (FR52) */}
          <TouchableOpacity
            className={`${Platform.OS === "ios" ? "py-3 min-h-[44px]" : Platform.OS === "android" ? "py-3.5 min-h-[48px]" : "py-3 min-h-[44px]"} px-6 rounded-lg items-center justify-center`}
            onPress={() => router.push("/privacy")}
            testID="privacy-policy-button"
            accessibilityLabel="View Privacy Policy"
            accessibilityRole="button"
          >
            <Text className="text-base opacity-70 underline text-gray-900 dark:text-gray-300">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
