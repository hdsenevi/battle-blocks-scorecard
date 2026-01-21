/**
 * Winner Announcement Screen
 * Displays the winner and final scores
 */

import { useEffect } from "react";
import {
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
      <ThemedView className="flex-1">
        <Text className="text-base">Loading...</Text>
      </ThemedView>
    );
  }

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort(
    (a, b) => b.current_score - a.current_score
  );

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
      >
        <View className="items-center mb-8 py-8">
          <Text className="text-4xl mb-4">
            🎉 Winner! 🎉
          </Text>
          <Text className="text-3xl font-bold mb-2">{winner.name}</Text>
          <Text className="text-2xl opacity-80">
            {winner.current_score} Points
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold mb-4">
            Final Scores
          </Text>
          {sortedPlayers.map((player, index) => (
            <View
              key={player.id}
              className={`flex-row items-center py-3 px-4 border-b border-gray-border ${
                player.id === winner.id ? "bg-primary-light rounded-lg mb-1" : ""
              }`}
            >
              <View className="w-10">
                <Text className="text-base font-semibold opacity-70">#{index + 1}</Text>
              </View>
              <View className="flex-1">
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
          className={`bg-primary ${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center`}
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
