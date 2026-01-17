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
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
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
          <ThemedText>Loading games...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (games.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>No Active Games</ThemedText>
          <ThemedText style={styles.subtitle}>
            Start a new game to begin playing
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/(tabs)")}
          >
            <ThemedText style={styles.buttonText}>Go to Home</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Select Game to Resume
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {games.length} {games.length === 1 ? "game" : "games"} to resume
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.list}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => handleSelectGame(game.id)}
            accessibilityLabel={`Resume game ${game.id}, started ${formatDate(
              game.created_at
            )}, ${game.playerCount} players`}
            accessibilityRole="button"
          >
            <View style={styles.gameCardContent}>
              <View style={styles.gameCardHeader}>
                <ThemedText style={styles.gameId}>Game #{game.id}</ThemedText>
                <ThemedText style={styles.gameDate}>
                  {formatDate(game.created_at)}
                </ThemedText>
              </View>
              <ThemedText style={styles.gamePlayers}>
                {game.playerCount} {game.playerCount === 1 ? "player" : "players"}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.replace("/(tabs)")}
          accessibilityLabel="Cancel and go to home"
          accessibilityRole="button"
        >
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
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
  headerTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
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
  gameId: {
    fontSize: 18,
    fontWeight: "600",
  },
  gameDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  gamePlayers: {
    fontSize: 14,
    opacity: 0.7,
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: Platform.select({ ios: 12, android: 14, default: 12 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
    textAlign: "center",
  },
});
