/**
 * Winner Announcement Screen
 * Displays the winner and final scores
 * Story 5.1: Winner Announcement Screen
 */

import { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Text,
  Animated,
  AccessibilityInfo,
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
  
  // Animation for smooth transition (Story 5.1: AC8 - < 200ms transition)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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

        // Story 5.1: Trigger completion haptic (AC: 5)
        triggerCompletion();
        
        // Story 5.1: Smooth fade-in animation (AC: 8 - < 200ms)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150, // < 200ms for smooth transition
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("Failed to load game:", error);
        router.replace("/(tabs)");
      }
    };

    loadGame();
  }, [id, dispatch, router, fadeAnim, scaleAnim]);

  const currentGame = gameState.currentGame;
  const players = gameState.players;
  const winner = players.find((p) => p.current_score === 50) || players[0];

  // Story 5.1: Accessibility - Screen reader announces winner (AC: 9)
  useEffect(() => {
    if (winner && currentGame) {
      const announcement = `${winner.name} wins with exactly 50 points! Game Over!`;
      AccessibilityInfo.announceForAccessibility(announcement);
    }
  }, [winner, currentGame]);

  const handleNewGame = () => {
    router.replace("/(tabs)");
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDuration = (createdAt: number, updatedAt: number): string => {
    const durationSeconds = updatedAt - createdAt;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        accessibilityLabel="Winner announcement screen"
      >
        {/* Story 5.1: Large, prominent display of winner's name with celebration (AC: 3) */}
        <Animated.View
          className="items-center mb-8 py-8"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          accessibilityRole="header"
          accessibilityLabel={`Winner: ${winner.name} with ${winner.current_score} points`}
        >
          {/* Story 5.1: Celebration visual elements (AC: 3) */}
          <View className="flex-row items-center mb-4">
            <Text className="text-5xl" accessibilityLabel="Celebration emoji">
              🎉
            </Text>
            <Text className="text-5xl font-bold mx-4 text-primary" accessibilityLabel="Winner announcement">
              Winner!
            </Text>
            <Text className="text-5xl" accessibilityLabel="Celebration emoji">
              🎉
            </Text>
          </View>
          
          {/* Story 5.1: Large, prominent display of winner's name (AC: 3) */}
          <Text 
            className="text-4xl font-bold mb-3 text-primary"
            accessibilityRole="text"
            accessibilityLabel={`Winner name: ${winner.name}`}
          >
            {winner.name}
          </Text>
          
          {/* Story 5.1: "Game Over!" message (AC: 3) */}
          <Text 
            className="text-xl mb-2 opacity-80"
            accessibilityRole="text"
            accessibilityLabel="Game Over message"
          >
            Game Over!
          </Text>
          
          <Text 
            className="text-2xl opacity-80"
            accessibilityRole="text"
            accessibilityLabel={`Final score: ${winner.current_score} points`}
          >
            {winner.current_score} Points
          </Text>
        </Animated.View>

        {/* Story 5.4: Game metadata display (AC: 3) */}
        <View className="mb-8 p-4 bg-gray-bg-light rounded-lg border border-gray-border">
          <Text 
            className="text-lg font-bold mb-3"
            accessibilityRole="header"
            accessibilityLabel="Game information"
          >
            Game Information
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm opacity-70">Status:</Text>
              <Text className="text-sm font-semibold capitalize">{currentGame.status}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm opacity-70">Date:</Text>
              <Text className="text-sm font-semibold">{formatDate(currentGame.updated_at)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm opacity-70">Time:</Text>
              <Text className="text-sm font-semibold">{formatTime(currentGame.updated_at)}</Text>
            </View>
            {currentGame.created_at && currentGame.updated_at && (
              <View className="flex-row justify-between">
                <Text className="text-sm opacity-70">Duration:</Text>
                <Text className="text-sm font-semibold">
                  {calculateDuration(currentGame.created_at, currentGame.updated_at)}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-sm opacity-70">Game ID:</Text>
              <Text className="text-sm font-semibold">#{currentGame.id}</Text>
            </View>
          </View>
        </View>

        {/* Story 5.2: Final scores display with accessibility (AC: 3, 5, 7) */}
        <View className="mb-8" accessibilityRole="list">
          <Text 
            className="text-xl font-bold mb-4"
            accessibilityRole="header"
            accessibilityLabel="Final scores list"
          >
            Final Scores
          </Text>
          {sortedPlayers.map((player, index) => (
            <View
              key={player.id}
              className={`flex-row items-center py-4 px-4 mb-2 rounded-lg border ${
                player.id === winner.id 
                  ? "bg-primary-light border-primary border-2" 
                  : "bg-gray-bg-light border-gray-border"
              }`}
              accessibilityRole="listitem"
              accessibilityLabel={`${index + 1}. ${player.name}, ${player.current_score} points${player.is_eliminated ? ", eliminated" : ""}`}
            >
              <View className="w-12 items-center justify-center">
                <Text 
                  className={`text-base font-bold ${
                    player.id === winner.id ? "text-primary" : "text-gray-text opacity-70"
                  }`}
                >
                  #{index + 1}
                </Text>
              </View>
              <View className="flex-1 ml-3">
                <Text 
                  className={`text-lg font-semibold ${
                    player.id === winner.id ? "text-primary" : "text-gray-text"
                  }`}
                >
                  {player.name}
                </Text>
                {player.is_eliminated && (
                  <Text className="text-xs opacity-60 mt-1">
                    Eliminated
                  </Text>
                )}
              </View>
              <View className="items-end">
                <Text 
                  className={`text-2xl font-bold ${
                    player.id === winner.id ? "text-primary" : "text-gray-text"
                  }`}
                >
                  {player.current_score}
                </Text>
                <Text className="text-xs opacity-60 mt-0.5">points</Text>
              </View>
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
