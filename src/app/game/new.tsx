/**
 * New Game Screen
 * Create a new game and add players
 */

import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNavigation, useRouter } from "expo-router";
import { useGameDispatch } from "@/contexts/GameContext";
import { createGame, addPlayer, DatabaseError } from "@/services/database";
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
      // Create game in database
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
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ThemedText type="title" style={styles.title}>
          New Game
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Add at least 2 players to start
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter player name"
            placeholderTextColor="#999"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={handleAddPlayer}
            accessibilityLabel="Player name input"
            accessibilityRole="textbox"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPlayer}
            accessibilityLabel="Add player"
            accessibilityRole="button"
          >
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </View>

        {players.length > 0 && (
          <View style={styles.playersContainer}>
            <ThemedText type="subtitle" style={styles.playersTitle}>
              Players ({players.length})
            </ThemedText>
            {players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <ThemedText style={styles.playerName}>{player.name}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleRemovePlayer(player.id)}
                  accessibilityLabel={`Remove ${player.name}`}
                  accessibilityRole="button"
                >
                  <ThemedText style={styles.removeButton}>Remove</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.startButton,
            (players.length < 2 || isCreating) && styles.startButtonDisabled,
          ]}
          onPress={handleStartGame}
          disabled={players.length < 2 || isCreating}
          accessibilityLabel="Start game"
          accessibilityRole="button"
        >
          <ThemedText style={styles.startButtonText}>
            {isCreating ? "Creating..." : "Start Game"}
          </ThemedText>
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
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, android: 14, default: 12 }),
    fontSize: 16,
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: Platform.select({ ios: 12, android: 14, default: 12 }),
    borderRadius: 8,
    justifyContent: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
    minWidth: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  playersContainer: {
    marginBottom: 24,
  },
  playersTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  playerName: {
    fontSize: 16,
  },
  removeButton: {
    color: "#FF3B30",
    fontSize: 14,
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingVertical: Platform.select({ ios: 16, android: 18, default: 16 }),
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  startButtonDisabled: {
    backgroundColor: "#CCCCCC",
    opacity: 0.6,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
