/**
 * Score Entry Modal Component
 * Interface for entering scores (single block or multiple blocks)
 */

import { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import type { Player } from "@/database/types";
import { calculateScore, checkPenaltyRule, checkElimination, checkWinCondition } from "@/services/gameRules";
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
  eliminatePlayerAction,
} from "@/reducers/actionCreators";
import { useGameState , useGameDispatch } from "@/contexts/GameContext";
import {
  triggerScoreEntry,
  triggerError,
  triggerCompletion,
  triggerPenalty,
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
  const gameState = useGameState();
  const router = useRouter();
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
        <View className="flex-1 bg-black/50 dark:bg-black/70 justify-center items-center p-5">
          <ThemedView className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-[400px] shadow-elevated">
            <Text className="text-2xl font-sans-semibold mb-2 text-stone-900 dark:text-stone-50">
              {gameStatus === "completed" ? "Game Completed" : gameStatus === "notcompleted" ? "Game Not Completed" : "Game Paused"}
            </Text>
            <Text className="text-base font-sans mb-6 opacity-70 text-stone-600 dark:text-stone-400">
              {statusMessage}
            </Text>
            <TouchableOpacity
              className={`flex-1 ${Platform.OS === "ios" ? "py-3.5 min-h-[44px]" : Platform.OS === "android" ? "py-4 min-h-[48px]" : "py-3.5 min-h-[44px]"} rounded-button items-center justify-center bg-primary dark:bg-primary-bright`}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text className="text-white text-base font-sans-semibold">Close</Text>
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
        <View className="flex-1 bg-black/50 dark:bg-black/70 justify-center items-center p-5">
          <ThemedView className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-[400px] shadow-elevated">
            <Text className="text-2xl font-sans-semibold mb-2 text-stone-900 dark:text-stone-50">
              Player Eliminated
            </Text>
            <Text className="text-base font-sans mb-6 opacity-70 text-stone-600 dark:text-stone-400">
              {player.name} has been eliminated for this round and cannot receive further scores until the next round begins.
            </Text>
            <TouchableOpacity
              className={`flex-1 ${Platform.OS === "ios" ? "py-3.5 min-h-[44px]" : Platform.OS === "android" ? "py-4 min-h-[48px]" : "py-3.5 min-h-[44px]"} rounded-button items-center justify-center bg-primary dark:bg-primary-bright`}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text className="text-white text-base font-sans-semibold">Close</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    );
  }

  // Prevent score entry if player has already scored in this round
  const hasPlayerScoredThisRound = gameState.playersWhoScoredThisRound.has(player.id);
  if (hasPlayerScoredThisRound) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
        accessibilityViewIsModal
      >
        <View className="flex-1 bg-black/50 dark:bg-black/70 justify-center items-center p-5">
          <ThemedView className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-[400px] shadow-elevated">
            <Text className="text-2xl font-sans-semibold mb-2 text-stone-900 dark:text-stone-50">
              Already Scored This Round
            </Text>
            <Text className="text-base font-sans mb-6 opacity-70 text-stone-600 dark:text-stone-400">
              {player.name} has already scored in Round {gameState.currentRound}. Please finish the round before scoring again.
            </Text>
            <TouchableOpacity
              className={`flex-1 ${Platform.OS === "ios" ? "py-3.5 min-h-[44px]" : Platform.OS === "android" ? "py-4 min-h-[48px]" : "py-3.5 min-h-[44px]"} rounded-button items-center justify-center bg-primary dark:bg-primary-bright`}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text className="text-white text-base font-sans-semibold">Close</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    );
  }

  const handleSubmit = async () => {
    // Story 5.3: Prevent score entry at service level (AC: 4)
    // Double-check game status even if UI was bypassed
    if (gameStatus === "completed" || gameStatus === "notcompleted") {
      Alert.alert(
        "Game Completed",
        "This game has been completed. No further score entries are allowed."
      );
      triggerError();
      onClose();
      return;
    }

    if (gameStatus === "paused") {
      Alert.alert(
        "Game Paused",
        "This game is paused. Resume the game to continue playing."
      );
      triggerError();
      onClose();
      return;
    }

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
          entryMode === "single" ? "single_block" : "multiple_blocks",
          gameState.currentRound
        );

        // Update context
        dispatch(updatePlayerAction(updatedPlayer));

        // Trigger haptic feedback
        triggerScoreEntry();

        // Close modal
        onClose();
        setBlockValue("");

        // Story 4.2: Check for elimination using checkElimination() - ROUND-SPECIFIC
        const shouldEliminate = checkElimination(newConsecutiveMisses);
        if (shouldEliminate) {
          // Mark player as eliminated for current round only (in state, not database)
          dispatch(eliminatePlayerAction(player.id));
          triggerError(); // Use error haptic for elimination
          Alert.alert(
            "Player Eliminated",
            `${player.name} has been eliminated for this round after 3 consecutive misses. They will be able to play again when the round is finished.`
          );
        } else {
          Alert.alert(
            "Miss Recorded",
            `${player.name} has ${newConsecutiveMisses} consecutive miss${newConsecutiveMisses > 1 ? "es" : ""}.`
          );
        }

        // Note: Player is NOT marked as having scored when they miss (score = 0)
        // They can still score later in the round if they haven't been eliminated
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

      // Story 4.1: Check for 50+ penalty rule using checkPenaltyRule()
      const penaltyApplied = checkPenaltyRule(newScore);
      if (penaltyApplied) {
        // Reset to 25
        newScore = 25;
        
        // Trigger strong haptic feedback for penalty
        await triggerPenalty();
        
        // Show clear message explaining what happened
        Alert.alert(
          "Penalty Applied",
          `${player.name}'s score exceeded 50 and has been reset to 25.`
        );
      }

      // Story 4.3: Check for win condition using checkWinCondition()
      const isWin = checkWinCondition(newScore);

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
        entryMode === "single" ? "single_block" : "multiple_blocks",
        gameState.currentRound
      );

      // Update context (this also marks player as having scored this round)
      dispatch(addScoreAction(player.id, score));
      dispatch(updatePlayerAction(updatedPlayer));

      // Story 4.3: Handle win condition
      if (isWin) {
        // Mark game as completed
        await updateGame(gameId, { status: "completed" });
        dispatch(completeGameAction(updatedPlayer));
        // Trigger haptic feedback (Story 5.1: AC5)
        triggerCompletion();
        // Close modal first
        onClose();
        setBlockValue("");
        setIsSubmitting(false);
        // Story 5.1: Navigate to winner screen automatically (AC: 2, 4)
        // Use replace to prevent going back to game screen
        router.replace(`/game/${gameId}/winner`);
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
      <View className="flex-1 bg-black/50 dark:bg-black/70 justify-center items-center p-5">
        <ThemedView className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-[400px] shadow-elevated">
          <Text className="text-2xl font-sans-semibold mb-2 text-stone-900 dark:text-stone-50">
            Enter Score for {player.name}
          </Text>

          <Text className="text-base font-sans mb-6 opacity-70 text-stone-600 dark:text-stone-400">
            Current Score: {player.current_score}
          </Text>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-button border-2 items-center ${Platform.OS === "ios" ? "min-h-[44px]" : Platform.OS === "android" ? "min-h-[48px]" : "min-h-[44px]"} justify-center ${
                entryMode === "single" 
                  ? "border-primary bg-primary dark:bg-primary-bright dark:border-primary-bright" 
                  : "border-gray-border dark:border-stone-600"
              }`}
              onPress={() => setEntryMode("single")}
              accessibilityLabel="Single block mode"
              accessibilityRole="button"
            >
              <Text
                className={`text-base font-sans-semibold ${
                  entryMode === "single" 
                    ? "text-white" 
                    : "text-primary dark:text-primary-bright"
                }`}
              >
                Single Block
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-button border-2 items-center ${Platform.OS === "ios" ? "min-h-[44px]" : Platform.OS === "android" ? "min-h-[48px]" : "min-h-[44px]"} justify-center ${
                entryMode === "multiple" 
                  ? "border-primary bg-primary dark:bg-primary-bright dark:border-primary-bright" 
                  : "border-gray-border dark:border-stone-600"
              }`}
              onPress={() => setEntryMode("multiple")}
              accessibilityLabel="Multiple blocks mode"
              accessibilityRole="button"
            >
              <Text
                className={`text-base font-sans-semibold ${
                  entryMode === "multiple" 
                    ? "text-white" 
                    : "text-primary dark:text-primary-bright"
                }`}
              >
                Multiple Blocks
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-base font-sans mb-4 opacity-70 text-stone-600 dark:text-stone-400">
            {entryMode === "single"
              ? "Enter the block number (e.g., 12 = 12 points)"
              : "Enter the number of blocks (e.g., 3 blocks = 3 points)"}
          </Text>

          <TextInput
            className={`border border-gray-border-medium dark:border-stone-600 rounded-button px-4 ${Platform.OS === "ios" ? "py-3 min-h-[44px]" : Platform.OS === "android" ? "py-3.5 min-h-[48px]" : "py-3 min-h-[44px]"} text-2xl font-sans text-center mb-6 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50`}
            placeholder={entryMode === "single" ? "Block number" : "Number of blocks"}
            placeholderTextColor="#78716C"
            value={blockValue}
            onChangeText={setBlockValue}
            keyboardType="number-pad"
            accessibilityLabel={
              entryMode === "single" ? "Block number input" : "Number of blocks input"
            }
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`flex-1 ${Platform.OS === "ios" ? "py-3.5 min-h-[44px]" : Platform.OS === "android" ? "py-4 min-h-[48px]" : "py-3.5 min-h-[44px]"} rounded-button items-center justify-center bg-gray-bg-light dark:bg-stone-700`}
              onPress={handleClose}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text className="text-primary dark:text-primary-bright text-base font-sans-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 ${Platform.OS === "ios" ? "py-3.5 min-h-[44px]" : Platform.OS === "android" ? "py-4 min-h-[48px]" : "py-3.5 min-h-[44px]"} rounded-button items-center justify-center bg-primary dark:bg-primary-bright ${isSubmitting ? "opacity-60" : ""} shadow-elevated`}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Submit score"
              accessibilityRole="button"
            >
              <Text className="text-white text-base font-sans-semibold">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

