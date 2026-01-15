/**
 * Winner Announcement Screen
 * Displays the winner and final scores
 */

import { useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGameState, useGameDispatch } from "@/contexts/GameContext";
import { getGame, getPlayersByGame } from "@/services/database";
import { resumeGameAction } from "@/reducers/actionCreators";
import { triggerCompletion } from "@/services/haptics";

export default function WinnerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  useEffect(() => {
    const loadGame = async () => {
      if (!id) {
        router.replace("/(tabs)");
        return;
      }

      const gameId = parseInt(id, 10);
      if (isNaN(gameId)) {
        router.replace("/(tabs)");
        return;
      }

      try {
        const game = await getGame(gameId);
        if (!game) {
          router.replace("/(tabs)");
          return;
        }

        const players = await getPlayersByGame(gameId);
        dispatch(resumeGameAction(game, players));

        // Trigger completion haptic
        triggerCompletion();
      } catch (error) {
        console.error("Failed to load game:", error);
        router.replace("/(tabs)");
      }
    };

    loadGame();
  }, [id, dispatch, router]);

  const currentGame = gameState.currentGame;
  const players = gameState.players;
  const winner = players.find((p) => p.current_score === 50) || players[0];

  const handleNewGame = () => {
    router.replace("/(tabs)");
  };

  if (!currentGame) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort(
    (a, b) => b.current_score - a.current_score
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.winnerSection}>
          <ThemedText type="title" style={styles.winnerTitle}>
            🎉 Winner! 🎉
          </ThemedText>
          <ThemedText style={styles.winnerName}>{winner.name}</ThemedText>
          <ThemedText style={styles.winnerScore}>{winner.current_score} Points</ThemedText>
        </View>

        <View style={styles.scoresSection}>
          <ThemedText type="subtitle" style={styles.scoresTitle}>
            Final Scores
          </ThemedText>
          {sortedPlayers.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.scoreRow,
                player.id === winner.id && styles.winnerRow,
              ]}
            >
              <View style={styles.rankContainer}>
                <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
              </View>
              <View style={styles.playerInfo}>
                <ThemedText style={styles.playerName}>{player.name}</ThemedText>
                {player.is_eliminated && (
                  <ThemedText style={styles.eliminatedLabel}>Eliminated</ThemedText>
                )}
              </View>
              <ThemedText style={styles.finalScore}>
                {player.current_score}
              </ThemedText>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.newGameButton}
          onPress={handleNewGame}
          accessibilityLabel="Start new game"
          accessibilityRole="button"
        >
          <ThemedText style={styles.newGameButtonText}>Start New Game</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  winnerSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 32,
  },
  winnerTitle: {
    fontSize: 36,
    marginBottom: 16,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  winnerScore: {
    fontSize: 24,
    opacity: 0.8,
  },
  scoresSection: {
    marginBottom: 32,
  },
  scoresTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  winnerRow: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    marginBottom: 4,
  },
  rankContainer: {
    width: 40,
  },
  rank: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.7,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  eliminatedLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  finalScore: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
  },
  newGameButton: {
    backgroundColor: "#007AFF",
    paddingVertical: Platform.select({ ios: 16, android: 18, default: 16 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  newGameButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
