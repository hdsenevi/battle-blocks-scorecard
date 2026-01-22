/**
 * Action Creators
 * Type-safe action creator functions for game state mutations
 */

import type { Game, Player } from "../database/types";
import type { GameAction } from "./gameReducer";

/**
 * Create START_GAME action
 */
export function startGameAction(game: Game): GameAction {
  return {
    type: "START_GAME",
    payload: { game },
  };
}

/**
 * Create ADD_PLAYER action
 */
export function addPlayerAction(player: Player): GameAction {
  return {
    type: "ADD_PLAYER",
    payload: { player },
  };
}

/**
 * Create ADD_SCORE action
 */
export function addScoreAction(playerId: number, score: number): GameAction {
  return {
    type: "ADD_SCORE",
    payload: { playerId, score },
  };
}

/**
 * Create APPLY_PENALTY action
 */
export function applyPenaltyAction(
  playerId: number,
  penalty: number
): GameAction {
  return {
    type: "APPLY_PENALTY",
    payload: { playerId, penalty },
  };
}

/**
 * Create ELIMINATE_PLAYER action
 */
export function eliminatePlayerAction(playerId: number): GameAction {
  return {
    type: "ELIMINATE_PLAYER",
    payload: { playerId },
  };
}

/**
 * Create UPDATE_PLAYER action
 */
export function updatePlayerAction(player: Player): GameAction {
  return {
    type: "UPDATE_PLAYER",
    payload: { player },
  };
}

/**
 * Create COMPLETE_GAME action
 */
export function completeGameAction(winner: Player | null): GameAction {
  return {
    type: "COMPLETE_GAME",
    payload: { winner },
  };
}

/**
 * Create RESUME_GAME action
 */
export function resumeGameAction(game: Game, players: Player[]): GameAction {
  return {
    type: "RESUME_GAME",
    payload: { game, players },
  };
}

/**
 * Create RESET_GAME action
 */
export function resetGameAction(): GameAction {
  return {
    type: "RESET_GAME",
  };
}

/**
 * Create PLAYER_SCORED action
 * Marks a player as having scored in the current round (handled in ADD_SCORE)
 */
export function playerScoredAction(playerId: number): GameAction {
  return {
    type: "PLAYER_SCORED",
    payload: { playerId },
  };
}

/**
 * Create START_NEW_ROUND action
 * Manually starts a new round (resets eliminations and consecutive misses)
 */
export function startNewRoundAction(): GameAction {
  return {
    type: "START_NEW_ROUND",
  };
}

/**
 * Create UNDO_LAST_SCORE action
 * Reverses the last score action in current round
 */
export function undoLastScoreAction(
  playerId: number,
  previousScore: number,
  previousConsecutiveMisses: number,
  previousIsEliminated: boolean,
  gameWasCompleted: boolean
): GameAction {
  return {
    type: "UNDO_LAST_SCORE",
    payload: {
      playerId,
      previousScore,
      previousConsecutiveMisses,
      previousIsEliminated,
      gameWasCompleted,
    },
  };
}
