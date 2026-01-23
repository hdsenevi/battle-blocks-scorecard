/**
 * Game Selection Screen
 * Allows user to select which active game to resume when multiple exist
 */

import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { useGameDispatch } from "@/contexts/GameContext";
import {
  listActiveGames,
  listPausedGames,
  getGame,
  getPlayersByGame,
  updateGame,
  DatabaseError,
} from "@/services/database";
import { resumeGameAction } from "@/reducers/actionCreators";
import type { Game } from "@/database/types";

interface GameWithMetadata extends Game {
  playerCount: number;
}

export default function GameSelectionScreen() {
  const router = useRouter();
  const dispatch = useGameDispatch();
  const [games, setGames] = useState<GameWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const activeGames = await listActiveGames();
        const pausedGames = await listPausedGames();
        const allResumableGames = [...activeGames, ...pausedGames];

        // Load player count for each game
        const gamesWithMetadata: GameWithMetadata[] = await Promise.all(
          allResumableGames.map(async (game) => {
            const players = await getPlayersByGame(game.id);
            return {
              ...game,
              playerCount: players.length,
            };
          })
        );

        setGames(gamesWithMetadata);
      } catch (err) {
        console.error("Failed to load active games:", err);
        setError(
          err instanceof DatabaseError
            ? err.message
            : "Failed to load games"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleSelectGame = async (gameId: number) => {
    try {
      const game = await getGame(gameId);
      if (!game) {
        setError("Game not found");
        return;
      }

      // Story 5.3: Prevent resume for completed games (AC: 7)
      if (game.status === "completed") {
        // Navigate to winner screen instead of game screen
        router.replace(`/game/${gameId}/winner`);
        return;
      }

      // If paused, make it active
      if (game.status === "paused") {
        await updateGame(gameId, { status: "active" });
        const updatedGame = await getGame(gameId);
        if (updatedGame) {
          const players = await getPlayersByGame(gameId);
          dispatch(resumeGameAction(updatedGame, players));
          router.replace(`/game/${gameId}`);
        }
      } else {
        const players = await getPlayersByGame(gameId);
        dispatch(resumeGameAction(game, players));
        router.replace(`/game/${gameId}`);
      }
    } catch (err) {
      console.error("Failed to resume game:", err);
      setError(
        err instanceof DatabaseError
          ? err.message
          : "Failed to resume game"
      );
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-base">Loading games...</Text>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-base text-red-500 mb-4 text-center">{error}</Text>
          <TouchableOpacity
            className={`bg-primary ${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center justify-center mt-4`}
            onPress={() => router.back()}
          >
            <Text className="text-white text-base font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (games.length === 0) {
    return (
      <ThemedView className="flex-1">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-2xl mb-2 text-center">No Active Games</Text>
          <Text className="text-base mb-6 text-center opacity-70">
            Start a new game to begin playing
          </Text>
          <TouchableOpacity
            className={`bg-primary ${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center justify-center mt-4`}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-white text-base font-semibold">Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="p-5 border-b border-gray-border">
        <Text className="text-2xl mb-2" testID="select-game-title">
          Select Game to Resume
        </Text>
        <Text className="text-sm opacity-70" testID="select-game-subtitle">
          {games.length} {games.length === 1 ? "game" : "games"} to resume
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            className={`bg-white rounded-xl p-4 border border-gray-border ${Platform.OS === "ios" ? "min-h-[80px]" : Platform.OS === "android" ? "min-h-[88px]" : "min-h-[80px]"}`}
            onPress={() => handleSelectGame(game.id)}
            testID={`game-card-${game.id}`}
            accessibilityLabel={`Resume game ${game.id}, started ${formatDate(
              game.created_at
            )}, ${game.playerCount} players`}
            accessibilityRole="button"
          >
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold">Game #{game.id}</Text>
                <Text className="text-sm opacity-70">
                  {formatDate(game.created_at)}
                </Text>
              </View>
              <Text className="text-sm opacity-70">
                {game.playerCount} {game.playerCount === 1 ? "player" : "players"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="p-4 border-t border-gray-border">
        <TouchableOpacity
          className={`${Platform.OS === "ios" ? "py-3 min-h-[44px]" : Platform.OS === "android" ? "py-3.5 min-h-[48px]" : "py-3 min-h-[44px]"} px-6 rounded-lg items-center justify-center`}
          onPress={() => router.replace("/(tabs)")}
          testID="cancel-game-selection-button"
          accessibilityLabel="Cancel and go to home"
          accessibilityRole="button"
        >
          <Text className="text-primary text-base font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
