/**
 * Main Game Screen
 * Displays all players and their current scores
 */

import { useEffect } from "react";
import { StyleSheet, View, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGameState } from "@/contexts/GameContext";
import { getGame, getPlayersByGame } from "@/services/database";
import { resumeGameAction } from "@/reducers/actionCreators";
import { useGameDispatch } from "@/contexts/GameContext";
import { PlayerCard } from "@/components/game/PlayerCard";
import { ScoreEntryModal } from "@/components/game/ScoreEntryModal";
import { useState } from "react";
import type { Player } from "@/database/types";

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isScoreModalVisible, setIsScoreModalVisible] = useState(false);

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

      // If game is already loaded in context, use it
      if (
        gameState.currentGame?.id === gameId &&
        gameState.players.length > 0
      ) {
        // Check if game is completed and navigate to winner screen
        if (gameState.gameStatus === "completed") {
          router.replace(`/game/${gameId}/winner`);
        }
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

        // If game is completed, navigate to winner screen
        if (game.status === "completed") {
          router.replace(`/game/${gameId}/winner`);
        }
      } catch (error) {
        console.error("Failed to load game:", error);
        router.replace("/(tabs)");
      }
    };

    loadGame();
  }, [id, dispatch, router, gameState.currentGame?.id, gameState.players.length, gameState.gameStatus]);

  // Watch for game completion
  useEffect(() => {
    if (currentGame?.status === "completed" && id) {
      router.replace(`/game/${id}/winner`);
    }
  }, [currentGame?.status, id, router]);

  const currentGame = gameState.currentGame;
  const players = gameState.players;
  const leader = gameState.leader;

  if (!currentGame) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading game...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Game #{currentGame.id}
        </ThemedText>
        <ThemedText style={styles.status}>
          Status: {currentGame.status}
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {players.length === 0 ? (
          <ThemedText style={styles.emptyText}>No players yet</ThemedText>
        ) : (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isLeader={leader?.id === player.id}
              gameId={currentGame.id}
              onPress={() => {
                if (!player.is_eliminated && currentGame.status === "active") {
                  setSelectedPlayer(player);
                  setIsScoreModalVisible(true);
                }
              }}
            />
          ))
        )}
      </ScrollView>

      <ScoreEntryModal
        visible={isScoreModalVisible}
        player={selectedPlayer}
        gameId={currentGame.id}
        onClose={() => {
          setIsScoreModalVisible(false);
          setSelectedPlayer(null);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    opacity: 0.7,
    textTransform: "capitalize",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.7,
  },
});
