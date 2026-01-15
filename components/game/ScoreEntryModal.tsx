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
import {
  calculateScore,
  checkPenaltyRule,
  checkElimination,
  checkWinCondition,
} from "@/services/gameRules";
import {
  addScoreEntry,
  updatePlayer,
  updateGame,
} from "@/services/database";
import {
  addScoreAction,
  updatePlayerAction,
  applyPenaltyAction,
  eliminatePlayerAction,
  completeGameAction,
} from "@/reducers/actionCreators";
import { useGameDispatch } from "@/contexts/GameContext";
import {
  triggerScoreEntry,
  triggerError,
  triggerPenalty,
  triggerCompletion,
} from "@/services/haptics";

interface ScoreEntryModalProps {
  visible: boolean;
  player: Player | null;
  gameId: number;
  onClose: () => void;
}

export function ScoreEntryModal({
  visible,
  player,
  gameId,
  onClose,
}: ScoreEntryModalProps) {
  const dispatch = useGameDispatch();
  const [entryMode, setEntryMode] = useState<"single" | "multiple">("single");
  const [blockValue, setBlockValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!player) {
    return null;
  }

  const handleSubmit = async () => {
    if (!blockValue.trim()) {
      Alert.alert("Error", "Please enter a block value");
      triggerError();
      return;
    }

    const value = parseInt(blockValue.trim(), 10);
    if (isNaN(value) || value < 0) {
      Alert.alert("Error", "Please enter a valid number (0 or greater)");
      triggerError();
      return;
    }

    // Handle zero as a miss (consecutive miss tracking - Story 3.7)
    if (value === 0) {
      try {
        // Increment consecutive misses
        const newConsecutiveMisses = player.consecutive_misses + 1;
        const updatedPlayer = await updatePlayer(player.id, {
          consecutive_misses: newConsecutiveMisses,
        });

        // Save miss entry to database
        await addScoreEntry({
          player_id: player.id,
          game_id: gameId,
          score_value: 0,
          entry_type: entryMode === "single" ? "single_block" : "multiple_blocks",
        });

        // Update context
        dispatch(updatePlayerAction(updatedPlayer));

        // Trigger haptic feedback
        triggerScoreEntry();

        // Close modal
        onClose();
        setBlockValue("");

        // Story 4.2: Check for elimination (3 consecutive misses)
        if (checkElimination(newConsecutiveMisses)) {
          // Mark player as eliminated
          const eliminatedPlayer = await updatePlayer(player.id, {
            is_eliminated: true,
          });
          dispatch(eliminatePlayerAction(player.id));
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
        Alert.alert("Error", "Failed to record miss. Please try again.");
        triggerError();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score using game rules
      const blocks = entryMode === "single" ? [value] : Array(value).fill(1);
      const score = calculateScore(blocks, entryMode === "multiple");

      // Calculate new score
      let newScore = player.current_score + score;

      // Story 4.1: Check for 50+ penalty rule
      if (checkPenaltyRule(newScore)) {
        // Reset to 25
        newScore = 25;
        triggerPenalty();
        Alert.alert(
          "Penalty Applied",
          `${player.name}'s score exceeded 50 and has been reset to 25.`
        );
      }

      // Story 4.3: Check for win condition (exactly 50)
      const isWin = checkWinCondition(newScore);

      // Update player score in database
      const updatedPlayer = await updatePlayer(player.id, {
        current_score: newScore,
        consecutive_misses: 0, // Reset on successful score
      });

      // Save score entry to database
      await addScoreEntry({
        player_id: player.id,
        game_id: gameId,
        score_value: score,
        entry_type: entryMode === "single" ? "single_block" : "multiple_blocks",
      });

      // Update context
      if (checkPenaltyRule(player.current_score + score)) {
        dispatch(applyPenaltyAction(player.id, newScore - (player.current_score + score)));
      } else {
        dispatch(addScoreAction(player.id, score));
      }
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
        // Navigate to winner screen - will be handled by parent component
        // For now, show alert and let parent handle navigation
        Alert.alert(
          "Game Over!",
          `${player.name} wins with exactly 50 points!`,
          [
            {
              text: "View Results",
              onPress: () => {
                // Navigation handled by checking game status in parent
              },
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
      Alert.alert("Error", "Failed to record score. Please try again.");
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
            accessibilityRole="textbox"
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
              style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
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
