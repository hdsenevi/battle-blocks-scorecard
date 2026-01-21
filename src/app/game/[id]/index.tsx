/**
 * Main Game Screen
 * Displays all players and their current scores
 */

import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/themed-view";
import { useGameState, useGameDispatch } from "@/contexts/GameContext";
import { getGame, getPlayersByGame, updateGame } from "@/services/database";
import { resumeGameAction, startNewRoundAction } from "@/reducers/actionCreators";
import { Alert } from "react-native";
import { PlayerCard } from "@/components/game/PlayerCard";
import { ScoreEntryModal } from "@/components/game/ScoreEntryModal";
import { ScoreHistory } from "@/components/game/ScoreHistory";
import type { Player } from "@/database/types";

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isScoreModalVisible, setIsScoreModalVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

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
  }, [
    id,
    dispatch,
    router,
    gameState.currentGame?.id,
    gameState.players.length,
    gameState.gameStatus,
  ]);

  const currentGame = gameState.currentGame;
  const players = gameState.players;
  const leader = gameState.leader;
  const currentRound = gameState.currentRound;
  const playersWhoScoredThisRound = gameState.playersWhoScoredThisRound;

  const handleFinishRound = () => {
    if (currentGame?.status !== "active") {
      Alert.alert("Error", "Can only finish rounds in active games.");
      return;
    }

    Alert.alert(
      "Finish Round",
      `Are you sure you want to finish Round ${currentRound}? This will reset eliminations and allow all players to score again in Round ${currentRound + 1}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish Round",
          style: "default",
          onPress: () => {
            dispatch(startNewRoundAction());
            Alert.alert(
              "Round Finished",
              `Round ${currentRound} finished. Starting Round ${currentRound + 1}.`
            );
          },
        },
      ]
    );
  };

  // Set navigation header title and back button text
  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
      ...(currentGame?.id && { title: `Game #${currentGame.id}` }),
    });
  }, [currentGame?.id, navigation]);

  // Watch for game completion
  useEffect(() => {
    if (currentGame?.status === "completed" && id) {
      router.replace(`/game/${id}/winner`);
    }
  }, [currentGame?.status, id, router]);

  // Pause game when navigating back (if game is active)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
      // Only pause if the game is currently active
      if (currentGame && currentGame.status === "active") {
        try {
          // Update game status to paused in database
          await updateGame(currentGame.id, { status: "paused" });
        } catch (error) {
          console.error("Failed to pause game:", error);
        }
      }
    });

    return unsubscribe;
  }, [navigation, currentGame]);

  if (!currentGame) {
    return (
      <ThemedView className="flex-1">
        <Text className="text-base">Loading game...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="flex-row justify-between items-center p-5 border-b border-gray-border">
        <View className="flex-1">
          <Text className="text-2xl mb-2" testID="game-title">
            Game #{currentGame.id}
          </Text>
          <Text className="text-sm opacity-70 capitalize" testID="game-status">
            Status: {currentGame.status} | Round {currentRound}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg bg-gray-bg-light ${Platform.OS === "ios" ? "min-h-[44px]" : Platform.OS === "android" ? "min-h-[48px]" : "min-h-[44px]"} justify-center`}
            onPress={() => setIsHistoryVisible(true)}
            testID="score-history-button"
            accessibilityLabel="View score history"
            accessibilityRole="button"
          >
            <Text className="text-primary text-base font-semibold">History</Text>
          </TouchableOpacity>
          {currentGame.status === "active" && (
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg bg-primary ${Platform.OS === "ios" ? "min-h-[44px]" : Platform.OS === "android" ? "min-h-[48px]" : "min-h-[44px]"} justify-center`}
              onPress={handleFinishRound}
              testID="finish-round-button"
              accessibilityLabel="Finish round"
              accessibilityRole="button"
            >
              <Text className="text-white text-base font-semibold">Finish Round</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {players.length === 0 ? (
          <Text className="text-center mt-10 opacity-70">No players yet</Text>
        ) : (
          players.map((player) => {
            const hasScored = playersWhoScoredThisRound.has(player.id);
            return (
              <PlayerCard
                key={player.id}
                player={player}
                isLeader={leader?.id === player.id}
                gameId={currentGame.id}
                hasScoredThisRound={hasScored}
                onPress={() => {
                  // Story 5.3: Prevent score entry for completed/notcompleted/paused games
                  // Story 4.2: Prevent score entry for eliminated players
                  // Prevent score entry if player already scored this round
                  if (currentGame.status === "active" && !player.is_eliminated && !hasScored) {
                    setSelectedPlayer(player);
                    setIsScoreModalVisible(true);
                  }
                }}
              />
            );
          })
        )}
      </ScrollView>

      <ScoreEntryModal
        visible={isScoreModalVisible}
        player={selectedPlayer}
        gameId={currentGame.id}
        gameStatus={currentGame.status}
        onClose={() => {
          setIsScoreModalVisible(false);
          setSelectedPlayer(null);
        }}
      />

      <ScoreHistory
        visible={isHistoryVisible}
        gameId={currentGame.id}
        onClose={() => setIsHistoryVisible(false)}
      />
    </ThemedView>
  );
}
