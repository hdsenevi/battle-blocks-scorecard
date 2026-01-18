/**
 * Game Selection Screen
 * Allows user to select which active game to resume when multiple exist
 */

import { useEffect, useState } from "react";
import {
  StyleSheet,
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
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <Text className="text-base">Loading games...</Text>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <Text className="text-base text-red-500 mb-4 text-center">{error}</Text>
          <TouchableOpacity
            style={styles.button}
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
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <Text className="text-2xl mb-2 text-center">No Active Games</Text>
          <Text className="text-base mb-6 text-center opacity-70">
            Start a new game to begin playing
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-white text-base font-semibold">Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text className="text-2xl mb-2" testID="select-game-title">
          Select Game to Resume
        </Text>
        <Text className="text-sm opacity-70" testID="select-game-subtitle">
          {games.length} {games.length === 1 ? "game" : "games"} to resume
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.list}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => handleSelectGame(game.id)}
            testID={`game-card-${game.id}`}
            accessibilityLabel={`Resume game ${game.id}, started ${formatDate(
              game.created_at
            )}, ${game.playerCount} players`}
            accessibilityRole="button"
          >
            <View style={styles.gameCardContent}>
              <View style={styles.gameCardHeader}>
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

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollView: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  gameCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: Platform.select({ ios: 80, android: 88, default: 80 }),
  },
  gameCardContent: {
    gap: 8,
  },
  gameCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: Platform.select({ ios: 16, android: 18, default: 16 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: Platform.select({ ios: 12, android: 14, default: 12 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
});
