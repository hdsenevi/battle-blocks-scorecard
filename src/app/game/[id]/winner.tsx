/**
 * Winner Announcement Screen
 * Displays the winner and final scores
 */

import { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
      title: "Game Winner",
    });
  }, [navigation]);

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
        <Text className="text-base">Loading...</Text>
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
          <Text className="text-4xl mb-4">
            🎉 Winner! 🎉
          </Text>
          <Text className="text-3xl font-bold mb-2">{winner.name}</Text>
          <Text className="text-2xl opacity-80">
            {winner.current_score} Points
          </Text>
        </View>

        <View style={styles.scoresSection}>
          <Text className="text-xl font-bold mb-4">
            Final Scores
          </Text>
          {sortedPlayers.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.scoreRow,
                player.id === winner.id && styles.winnerRow,
              ]}
            >
              <View style={styles.rankContainer}>
                <Text className="text-base font-semibold opacity-70">#{index + 1}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text className="text-lg font-semibold">{player.name}</Text>
                {player.is_eliminated && (
                  <Text className="text-xs opacity-60 mt-1">
                    Eliminated
                  </Text>
                )}
              </View>
              <Text className="text-xl font-bold text-primary">
                {player.current_score}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.newGameButton}
          onPress={handleNewGame}
          accessibilityLabel="Start new game"
          accessibilityRole="button"
        >
          <Text className="text-white text-lg font-semibold">
            Start New Game
          </Text>
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
  scoresSection: {
    marginBottom: 32,
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
  playerInfo: {
    flex: 1,
  },
  newGameButton: {
    backgroundColor: "#007AFF",
    paddingVertical: Platform.select({ ios: 16, android: 18, default: 16 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
});
