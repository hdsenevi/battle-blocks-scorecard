import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  listCompletedGames,
  getPlayersByGame,
  DatabaseError,
} from "@/services/database";
import type { Game } from "@/database/types";

interface GameWithMetadata extends Game {
  playerCount: number;
  winnerName?: string;
  winnerScore?: number;
}

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [games, setGames] = useState<GameWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompletedGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const completedGames = await listCompletedGames();

        // Load player data for each game to get winner and player count
        const gamesWithMetadata: GameWithMetadata[] = await Promise.all(
          completedGames.map(async (game) => {
            const players = await getPlayersByGame(game.id);
            // Find winner (player with 50 points or highest score)
            const winner =
              players.find((p) => p.current_score === 50) ||
              players.reduce((prev, curr) =>
                curr.current_score > prev.current_score ? curr : prev
              );

            return {
              ...game,
              playerCount: players.length,
              winnerName: winner?.name,
              winnerScore: winner?.current_score,
            };
          })
        );

        setGames(gamesWithMetadata);
      } catch (err) {
        console.error("Failed to load completed games:", err);
        setError(
          err instanceof DatabaseError
            ? err.message
            : "Failed to load game history"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedGames();
  }, []);

  const handleViewGame = (gameId: number) => {
    router.push(`/game/${gameId}/winner`);
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
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <ThemedText>Loading history...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (games.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <ThemedText type="title" style={styles.title}>
            No Completed Games
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Completed games will appear here
          </ThemedText>
        </View>
      </ThemedView>
    );
  }
    
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Game History
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {games.length} completed {games.length === 1 ? "game" : "games"}
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.list}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => handleViewGame(game.id)}
            accessibilityLabel={`View game ${game.id}, completed ${formatDate(
              game.updated_at
            )}, winner ${game.winnerName}`}
            accessibilityRole="button"
          >
            <View style={styles.gameCardContent}>
              <View style={styles.gameCardHeader}>
                <ThemedText style={styles.gameId}>Game #{game.id}</ThemedText>
                <ThemedText style={styles.gameDate}>
                  {formatDate(game.updated_at)}
                </ThemedText>
              </View>
              {game.winnerName && (
                <View style={styles.winnerInfo}>
                  <ThemedText style={styles.winnerLabel}>Winner:</ThemedText>
                  <ThemedText style={styles.winnerName}>
                    {game.winnerName} ({game.winnerScore} pts)
                  </ThemedText>
                </View>
              )}
              <ThemedText style={styles.gamePlayers}>
                {game.playerCount} {game.playerCount === 1 ? "player" : "players"}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    minHeight: Platform.select({ ios: 100, android: 108, default: 100 }),
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
  winnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  winnerLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  gamePlayers: {
    fontSize: 14,
    opacity: 0.7,
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
    textAlign: "center",
  },
});
