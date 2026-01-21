/**
 * New Game Screen
 * Create a new game and add players
 */

import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { useNavigation, useRouter } from "expo-router";
import { useGameDispatch } from "@/contexts/GameContext";
import { createGame, addPlayer, DatabaseError, updateGame, listPausedGames } from "@/services/database";
import { startGameAction, addPlayerAction } from "@/reducers/actionCreators";

export default function NewGameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useGameDispatch();
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
      title: "New Game",
    });
  }, [navigation]);

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      Alert.alert("Error", "Please enter a player name");
      return;
    }

    if (trimmedName.length > 50) {
      Alert.alert("Error", "Player name must be 50 characters or less");
      return;
    }

    // Add to local state (will be saved to DB when game is created)
    const newPlayer = {
      id: Date.now(), // Temporary ID
      name: trimmedName,
    };
    setPlayers([...players, newPlayer]);
    setPlayerName("");
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      Alert.alert(
        "Not Enough Players",
        "You need at least 2 players to start a game"
      );
      return;
    }

    setIsCreating(true);

    try {
      const pausedGames = await listPausedGames();

      // Update all paused games to notcompleted
      for (const pausedGame of pausedGames) {
        await updateGame(pausedGame.id, { status: "notcompleted" });
      }

      // Create new game in database
      const game = await createGame("active");

      // Initialize game in context
      dispatch(startGameAction(game));

      // Add all players to database and context
      for (const player of players) {
        const dbPlayer = await addPlayer(game.id, player.name);

        dispatch(addPlayerAction(dbPlayer));
      }

      // Navigate to main game screen
      router.replace(`/game/${game.id}`);
    } catch (error) {
      setIsCreating(false);
      if (error instanceof DatabaseError) {
        Alert.alert("Error", `Failed to create game: ${error.message}`);
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    }
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
      >
        <Text className="text-3xl font-bold mb-2">
          New Game
        </Text>

        <Text className="text-base mb-6 opacity-70">
          Add at least 2 players to start
        </Text>

        <View className="flex-row gap-3 mb-6">
          <TextInput
            className={`flex-1 border border-gray-border-medium rounded-lg px-4 ${Platform.OS === "ios" ? "py-3 min-h-[44px]" : Platform.OS === "android" ? "py-3.5 min-h-[48px]" : "py-3 min-h-[44px]"} text-base`}
            placeholder="Enter player name"
            placeholderTextColor="#999"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={handleAddPlayer}
            accessibilityLabel="Player name input"
            testID="player-name-input"
          />
          <TouchableOpacity
            className={`bg-primary px-6 ${Platform.OS === "ios" ? "py-3 min-h-[44px] min-w-[44px]" : Platform.OS === "android" ? "py-3.5 min-h-[48px] min-w-[48px]" : "py-3 min-h-[44px] min-w-[44px]"} rounded-lg justify-center`}
            onPress={handleAddPlayer}
            accessibilityLabel="Add player"
            accessibilityRole="button"
            testID="add-player-button"
          >
            <Text className="text-white text-base font-semibold">Add</Text>
          </TouchableOpacity>
        </View>

        {players.length > 0 && (
          <View className="mb-6">
            <Text 
              className="text-xl font-bold mb-3"
              testID={`players-count-${players.length}`}
            >
              Players ({players.length})
            </Text>
            {players.map((player) => (
              <View key={player.id} className="flex-row justify-between items-center py-3 px-4 border-b border-gray-border">
                <Text className="text-base">{player.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemovePlayer(player.id)}
                  accessibilityLabel={`Remove ${player.name}`}
                  accessibilityRole="button"
                >
                  <Text className="text-red-500 text-sm">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className={`bg-primary ${Platform.OS === "ios" ? "py-4 min-h-[44px]" : Platform.OS === "android" ? "py-[18px] min-h-[48px]" : "py-4 min-h-[44px]"} px-6 rounded-lg items-center ${(players.length < 2 || isCreating) ? "bg-gray-border-medium opacity-60" : ""}`}
          onPress={handleStartGame}
          disabled={players.length < 2 || isCreating}
          accessibilityLabel="Start game"
          accessibilityRole="button"
          testID="start-game-button"
        >
          <Text className="text-white text-lg font-semibold">
            {isCreating ? "Creating..." : "Start Game"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}
