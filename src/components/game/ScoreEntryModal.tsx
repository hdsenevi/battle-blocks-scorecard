/**
 * Score Entry Modal Component
 * Interface for entering scores (single block or multiple blocks)
 */

import { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { Player } from "@/database/types";
import { calculateScore } from "@/services/gameRules";
import {
  addScoreEntry,
  updatePlayer,
  updateGame,
  DatabaseError,
} from "@/services/database";
import {
  addScoreAction,
  updatePlayerAction,
  completeGameAction,
} from "@/reducers/actionCreators";
import { useGameDispatch } from "@/contexts/GameContext";
import {
  triggerScoreEntry,
  triggerError,
  triggerCompletion,
} from "@/services/haptics";

interface ScoreEntryModalProps {
  visible: boolean;
  player: Player | null;
  gameId: number;
  gameStatus?: string;
  onClose: () => void;
}

export function ScoreEntryModal({
  visible,
  player,
  gameId,
  gameStatus = "active",
  onClose,
}: ScoreEntryModalProps) {
  const dispatch = useGameDispatch();
  const [entryMode, setEntryMode] = useState<"single" | "multiple">("single");
  const [blockValue, setBlockValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  if (!player) {
    return null;
  }

  // Story 5.3: Prevent score entries after completion or for non-active games
  if (gameStatus === "completed" || gameStatus === "notcompleted" || gameStatus === "paused") {
    const statusMessage = 
      gameStatus === "completed" 
        ? "This game has been completed. No further score entries are allowed."
        : gameStatus === "notcompleted"
        ? "This game was not completed. No further score entries are allowed."
        : "This game is paused. Resume the game to continue playing.";
    
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
        accessibilityViewIsModal
      >
        <View style={styles.overlay}>
          <ThemedView style={styles.modal}>
            <ThemedText type="title" style={styles.title}>
              {gameStatus === "completed" ? "Game Completed" : gameStatus === "notcompleted" ? "Game Not Completed" : "Game Paused"}
            </ThemedText>
            <ThemedText style={styles.instruction}>
              {statusMessage}
            </ThemedText>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <ThemedText style={styles.submitButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    );
  }

  // Story 4.2: Prevent score entry for eliminated players
  if (player.is_eliminated) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
        accessibilityViewIsModal
      >
        <View style={styles.overlay}>
          <ThemedView style={styles.modal}>
            <ThemedText type="title" style={styles.title}>
              Player Eliminated
            </ThemedText>
            <ThemedText style={styles.instruction}>
              {player.name} has been eliminated and cannot receive further scores.
            </ThemedText>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <ThemedText style={styles.submitButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    );
  }

  const handleSubmit = async () => {
    // Story 6.2: Prevent rapid duplicate score entries
    const now = Date.now();
    if (now - lastSubmitTime < 500) {
      Alert.alert("Please wait", "Please wait a moment before submitting again");
      triggerError();
      return;
    }

    // Story 6.1 & 6.3: Handle invalid score entries and edge cases
    if (!blockValue.trim()) {
      Alert.alert("Error", "Please enter a block value");
      triggerError();
      return;
    }

    const trimmedValue = blockValue.trim();

    // Check for non-numeric input
    if (!/^\d+$/.test(trimmedValue)) {
      Alert.alert("Invalid Input", "Please enter a valid number");
      triggerError();
      return;
    }

    const value = parseInt(trimmedValue, 10);

    // Validate value
    if (isNaN(value) || value < 0) {
      Alert.alert("Invalid Input", "Please enter a valid number (0 or greater)");
      triggerError();
      return;
    }

    // Story 6.3: Handle very large numbers
    const MAX_REASONABLE_VALUE = 1000;
    if (value > MAX_REASONABLE_VALUE) {
      Alert.alert(
        "Value Too Large",
        `Please enter a value less than ${MAX_REASONABLE_VALUE}`
      );
      triggerError();
      return;
    }

    setLastSubmitTime(now);
    setIsSubmitting(true);

    // Handle zero as a miss (consecutive miss tracking - Story 3.7)
    if (value === 0) {
      try {
        // Validate player and gameId before proceeding
        if (!player || !player.id || !gameId) {
          throw new Error("Invalid player or game data");
        }

        // Increment consecutive misses
        const newConsecutiveMisses = player.consecutive_misses + 1;
        const updatedPlayer = await updatePlayer(player.id, {
          consecutive_misses: newConsecutiveMisses,
        });

        // Save miss entry to database
        await addScoreEntry(
          player.id,
          gameId,
          0,
          entryMode === "single" ? "single_block" : "multiple_blocks"
        );

        // Update context
        dispatch(updatePlayerAction(updatedPlayer));

        // Trigger haptic feedback
        triggerScoreEntry();

        // Close modal
        onClose();
        setBlockValue("");

        // Story 4.2: Check for elimination (3 consecutive misses)
        if (newConsecutiveMisses >= 3) {
          // Mark player as eliminated
          const eliminatedPlayer = await updatePlayer(player.id, {
            is_eliminated: true,
          });
          dispatch(updatePlayerAction(eliminatedPlayer));
          triggerError(); // Use error haptic for elimination
          Alert.alert(
            "Player Eliminated",
            `${player.name} has been eliminated after 3 consecutive misses.`
          );
        } else {
          Alert.alert(
            "Miss Recorded",
            `${player.name} has ${newConsecutiveMisses} consecutive miss${newConsecutiveMisses > 1 ? "es" : ""}.`
          );
        }
      } catch (error) {
        console.error("Failed to record miss:", error);
        
        // Extract error message more reliably
        let errorMessage = "Unknown error";
        if (error instanceof DatabaseError) {
          errorMessage = error.message || "Database operation failed";
        } else if (error instanceof Error) {
          errorMessage = error.message || "An error occurred";
        } else if (typeof error === "string") {
          errorMessage = error;
        } else {
          errorMessage = String(error) || "Unknown error";
        }
        
        Alert.alert(
          "Error",
          `Failed to record miss. ${errorMessage} Please try again.`
        );
        triggerError();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      // Validate player and gameId before proceeding
      if (!player || !player.id || !gameId) {
        throw new Error("Invalid player or game data");
      }

      // Calculate score using game rules
      const blocks = entryMode === "single" ? [value] : Array(value).fill(1);
      const score = calculateScore(blocks, entryMode === "multiple");

      // Calculate new score
      let newScore = player.current_score + score;

      // Story 4.1: Check for 50+ penalty rule
      if (newScore > 50) {
        // Reset to 25
        newScore = 25;
        Alert.alert(
          "Penalty Applied",
          `${player.name}'s score exceeded 50 and has been reset to 25.`
        );
      }

      // Story 4.3: Check for win condition (exactly 50)
      const isWin = newScore === 50;

      // Update player score in database
      const updatedPlayer = await updatePlayer(player.id, {
        current_score: newScore,
        consecutive_misses: 0, // Reset on successful score
      });

      // Save score entry to database
      await addScoreEntry(
        player.id,
        gameId,
        score,
        entryMode === "single" ? "single_block" : "multiple_blocks"
      );

      // Update context
      dispatch(addScoreAction(player.id, score));
      dispatch(updatePlayerAction(updatedPlayer));

      // Story 4.3: Handle win condition
      if (isWin) {
        // Mark game as completed
        await updateGame(gameId, { status: "completed" });
        dispatch(completeGameAction(updatedPlayer));
        triggerCompletion();
        onClose();
        setBlockValue("");
        setIsSubmitting(false);
        Alert.alert(
          "Game Over!",
          `${player.name} wins with exactly 50 points!`,
          [
            {
              text: "OK",
            },
          ]
        );
        return;
      }

      // Trigger haptic feedback
      triggerScoreEntry();

      // Close modal
      onClose();
      setBlockValue("");
    } catch (error) {
      console.error("Failed to record score:", error);
      
      // Extract error message more reliably
      let errorMessage = "Unknown error";
      if (error instanceof DatabaseError) {
        errorMessage = error.message || "Database operation failed";
      } else if (error instanceof Error) {
        errorMessage = error.message || "An error occurred";
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = String(error) || "Unknown error";
      }
      
      Alert.alert(
        "Error",
        `Failed to record score. ${errorMessage} Please try again.`
      );
      triggerError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBlockValue("");
    setEntryMode("single");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <ThemedText type="title" style={styles.title}>
            Enter Score for {player.name}
          </ThemedText>

          <ThemedText style={styles.currentScore}>
            Current Score: {player.current_score}
          </ThemedText>

          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                entryMode === "single" && styles.modeButtonActive,
              ]}
              onPress={() => setEntryMode("single")}
              accessibilityLabel="Single block mode"
              accessibilityRole="button"
            >
              <ThemedText
                style={[
                  styles.modeButtonText,
                  entryMode === "single" && styles.modeButtonTextActive,
                ]}
              >
                Single Block
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                entryMode === "multiple" && styles.modeButtonActive,
              ]}
              onPress={() => setEntryMode("multiple")}
              accessibilityLabel="Multiple blocks mode"
              accessibilityRole="button"
            >
              <ThemedText
                style={[
                  styles.modeButtonText,
                  entryMode === "multiple" && styles.modeButtonTextActive,
                ]}
              >
                Multiple Blocks
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.instruction}>
            {entryMode === "single"
              ? "Enter the block number (e.g., 12 = 12 points)"
              : "Enter the number of blocks (e.g., 3 blocks = 3 points)"}
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder={entryMode === "single" ? "Block number" : "Number of blocks"}
            placeholderTextColor="#999"
            value={blockValue}
            onChangeText={setBlockValue}
            keyboardType="number-pad"
            accessibilityLabel={
              entryMode === "single" ? "Block number input" : "Number of blocks input"
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Submit score"
              accessibilityRole="button"
            >
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  currentScore: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
  },
  modeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    alignItems: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
    justifyContent: "center",
  },
  modeButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  modeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  instruction: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, android: 14, default: 12 }),
    fontSize: 24,
    textAlign: "center",
    marginBottom: 24,
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: Platform.select({ ios: 14, android: 16, default: 14 }),
    borderRadius: 8,
    alignItems: "center",
    minHeight: Platform.select({ ios: 44, android: 48, default: 44 }),
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
