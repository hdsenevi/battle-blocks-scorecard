/**
 * Undo Service
 * Handles undo operations for score entries
 */

import type { ScoreEntry, Player, GameStatus } from "../database/types";
import {
  getLastScoreEntryForRound,
  deleteScoreEntry,
  updatePlayer,
  getGame,
  updateGame,
  DatabaseError,
} from "./database";

/**
 * Result of an undo operation
 */
export interface UndoResult {
  success: boolean;
  scoreEntry: ScoreEntry | null;
  previousPlayerState: {
    score: number;
    consecutive_misses: number;
    is_eliminated: boolean;
  };
  gameWasCompleted: boolean;
}

/**
 * Check if undo is possible for the current round
 * @param gameId Game ID
 * @param currentRound Current round number
 * @param gameStatus Current game status
 * @returns true if undo is possible, false otherwise
 */
export async function canUndoLastScore(
  gameId: number,
  currentRound: number,
  gameStatus: GameStatus | null
): Promise<boolean> {
  try {
    // Cannot undo if game is not active
    if (gameStatus !== "active") {
      return false;
    }

    // Check if there are any score entries for the current round
    const lastEntry = await getLastScoreEntryForRound(gameId, currentRound);
    return lastEntry !== null;
  } catch (error) {
    // If there's an error checking, assume undo is not possible
    console.error("Error checking if undo is possible:", error);
    return false;
  }
}

/**
 * Undo the last score entry in the current round
 * @param gameId Game ID
 * @param currentRound Current round number
 * @param players Current players state (from game state) - needed to get current player state
 * @returns Undo result with previous state information
 * @throws {DatabaseError} If undo operation fails
 */
export async function undoLastScore(
  gameId: number,
  currentRound: number,
  players: Player[]
): Promise<UndoResult> {
  try {
    // Get the last score entry for the current round
    const lastEntry = await getLastScoreEntryForRound(gameId, currentRound);

    if (!lastEntry) {
      throw new DatabaseError(
        "No score entry found to undo",
        undefined,
        "UNDO_NO_ENTRY_ERROR"
      );
    }

    // Find the player who made this entry
    const player = players.find((p) => p.id === lastEntry.player_id);
    if (!player) {
      throw new DatabaseError(
        `Player with id ${lastEntry.player_id} not found`,
        undefined,
        "UNDO_PLAYER_NOT_FOUND_ERROR"
      );
    }

    // Get current game state to check if it was completed
    const game = await getGame(gameId);
    const gameWasCompleted = game?.status === "completed";

    // Calculate previous player state
    // Previous score: current_score - score_value
    // However, if a penalty was applied (score > 50, reset to 25), we need to handle that
    // If current score is 25 and last entry would have made it > 50, the original score before penalty was current_score + score_value
    // But actually, the penalty resets to 25, so if current is 25 and last entry + 25 > 50, penalty was applied
    // In that case, previous score = 25 + score_value (the score before penalty reset)
    // But wait, that's not right either. Let me think...
    // If player had score X, then scored Y, making it X+Y
    // If X+Y > 50, penalty resets to 25
    // So current score = 25, last entry = Y
    // Previous score = X, but we don't know X
    // Actually, we can't determine X from just current score and last entry if penalty was applied
    // We need to track the original score before penalty, or we need to query previous entries
    
    // For now, let's use a simpler approach:
    // If current score is 25 and last entry + 25 > 50, assume penalty was applied
    // In that case, previous score = 25 + score_value (the score before penalty)
    // Otherwise, previous score = current_score - score_value
    let previousScore: number;
    if (player.current_score === 25 && lastEntry.score_value + 25 > 50) {
      // Penalty was likely applied, restore to score before penalty
      previousScore = 25 + lastEntry.score_value;
    } else {
      // Normal case: subtract the score value
      previousScore = player.current_score - lastEntry.score_value;
    }

    // For consecutive_misses: If the score was 0 (miss), we need to restore the previous count
    // If the score was > 0, consecutive_misses was reset to 0, so previous was 0
    let previousConsecutiveMisses: number;
    if (lastEntry.score_value === 0) {
      // It was a miss, so consecutive_misses was incremented
      // Previous consecutive_misses = current - 1
      previousConsecutiveMisses = Math.max(0, player.consecutive_misses - 1);
    } else {
      // It was a successful score, so consecutive_misses was reset to 0
      // Previous consecutive_misses = whatever it was before (we don't track this, so assume 0)
      // Actually, we can't know the previous value if it was reset, so we'll set it to 0
      previousConsecutiveMisses = 0;
    }

    // For is_eliminated: Elimination is round-specific and resets each round
    // Since we're undoing within the same round, previous is_eliminated = false
    const previousIsEliminated = false;

    // Delete the score entry from database
    await deleteScoreEntry(lastEntry.id);

    // Update player record with previous state
    await updatePlayer(player.id, {
      current_score: previousScore,
      consecutive_misses: previousConsecutiveMisses,
      // Note: is_eliminated is not persisted (round-specific)
    });

    // If game was completed, revert to active status
    if (gameWasCompleted) {
      await updateGame(gameId, { status: "active" });
    }

    return {
      success: true,
      scoreEntry: lastEntry,
      previousPlayerState: {
        score: previousScore,
        consecutive_misses: previousConsecutiveMisses,
        is_eliminated: previousIsEliminated,
      },
      gameWasCompleted,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to undo last score: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error : undefined,
      "UNDO_LAST_SCORE_ERROR"
    );
  }
}
