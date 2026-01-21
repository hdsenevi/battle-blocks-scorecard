/**
 * Game State Reducer
 * Handles all game state mutations using immutable updates
 */

import type { Game, Player, GameStatus } from "../database/types";

/**
 * Game state structure
 */
export interface GameState {
  currentGame: Game | null;
  players: Player[];
  gameStatus: GameStatus | null;
  leader: Player | null;
  currentRound: number;
  playersWhoScoredThisRound: Set<number>; // Player IDs who have scored in current round
}

/**
 * Action types for game state mutations
 */
export type GameAction =
  | { type: "START_GAME"; payload: { game: Game } }
  | { type: "ADD_PLAYER"; payload: { player: Player } }
  | { type: "ADD_SCORE"; payload: { playerId: number; score: number } }
  | { type: "APPLY_PENALTY"; payload: { playerId: number; penalty: number } }
  | { type: "ELIMINATE_PLAYER"; payload: { playerId: number } }
  | { type: "COMPLETE_GAME"; payload: { winner: Player | null } }
  | { type: "RESUME_GAME"; payload: { game: Game; players: Player[] } }
  | { type: "UPDATE_PLAYER"; payload: { player: Player } }
  | { type: "RESET_GAME" }
  | { type: "PLAYER_SCORED"; payload: { playerId: number } }
  | { type: "START_NEW_ROUND" };

/**
 * Initial game state
 */
export const initialState: GameState = {
  currentGame: null,
  players: [],
  gameStatus: null,
  leader: null,
  currentRound: 1,
  playersWhoScoredThisRound: new Set<number>(),
};

/**
 * Calculate the current leader based on scores
 */
function calculateLeader(players: Player[]): Player | null {
  const activePlayers = players.filter((p) => !p.is_eliminated);
  if (activePlayers.length === 0) {
    return null;
  }

  // Find player with highest score
  const leader = activePlayers.reduce((prev, current) => {
    if (current.current_score > prev.current_score) {
      return current;
    }
    return prev;
  });

  // Check if there's a tie (multiple players with same highest score)
  const leaderScore = leader.current_score;
  const playersWithLeaderScore = activePlayers.filter(
    (p) => p.current_score === leaderScore
  );

  // If tie, return null (no single leader)
  if (playersWithLeaderScore.length > 1) {
    return null;
  }

  return leader;
}

/**
 * Game state reducer
 * All state updates are immutable
 */
export function gameReducer(
  state: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...state,
        currentGame: action.payload.game,
        players: [],
        gameStatus: action.payload.game.status,
        leader: null,
        currentRound: 1,
        playersWhoScoredThisRound: new Set<number>(),
      };
    }

    case "ADD_PLAYER": {
      const newPlayers = [...state.players, action.payload.player];
      return {
        ...state,
        players: newPlayers,
        leader: calculateLeader(newPlayers),
      };
    }

    case "ADD_SCORE": {
      const { playerId, score } = action.payload;
      const updatedPlayers = state.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            current_score: player.current_score + score,
            consecutive_misses: 0, // Reset consecutive misses on successful score
            is_eliminated: false, // Reset elimination on successful score (round-specific)
          };
        }
        return player;
      });

      // Track that this player has scored in the current round
      const newPlayersWhoScored = new Set(state.playersWhoScoredThisRound);
      newPlayersWhoScored.add(playerId);

      return {
        ...state,
        players: updatedPlayers,
        playersWhoScoredThisRound: newPlayersWhoScored,
        leader: calculateLeader(updatedPlayers),
      };
    }

    case "APPLY_PENALTY": {
      const { playerId, penalty } = action.payload;
      const updatedPlayers = state.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            current_score: player.current_score + penalty,
          };
        }
        return player;
      });

      return {
        ...state,
        players: updatedPlayers,
        leader: calculateLeader(updatedPlayers),
      };
    }

    case "ELIMINATE_PLAYER": {
      const { playerId } = action.payload;
      const updatedPlayers = state.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            is_eliminated: true, // Round-specific elimination (in state only, not persisted to DB)
          };
        }
        return player;
      });

      return {
        ...state,
        players: updatedPlayers,
        leader: calculateLeader(updatedPlayers),
      };
    }

    case "UPDATE_PLAYER": {
      const updatedPlayer = action.payload.player;
      const updatedPlayers = state.players.map((player) => {
        if (player.id === updatedPlayer.id) {
          return updatedPlayer;
        }
        return player;
      });

      return {
        ...state,
        players: updatedPlayers,
        leader: calculateLeader(updatedPlayers),
      };
    }

    case "COMPLETE_GAME": {
      const updatedGame = state.currentGame
        ? {
            ...state.currentGame,
            status: "completed" as GameStatus,
            updated_at: Math.floor(Date.now() / 1000),
          }
        : null;

      return {
        ...state,
        currentGame: updatedGame,
        gameStatus: "completed",
        leader: action.payload.winner,
      };
    }

    case "RESUME_GAME": {
      // Reset eliminations when resuming (round-specific elimination)
      const playersWithResetElimination = action.payload.players.map((player) => ({
        ...player,
        is_eliminated: false, // Reset elimination on resume (round-specific)
      }));

      return {
        ...state,
        currentGame: action.payload.game,
        players: playersWithResetElimination,
        gameStatus: action.payload.game.status,
        leader: calculateLeader(playersWithResetElimination),
        currentRound: 1,
        playersWhoScoredThisRound: new Set<number>(),
      };
    }

    case "RESET_GAME": {
      return initialState;
    }

    case "PLAYER_SCORED": {
      // This action is handled in ADD_SCORE, but kept for compatibility
      // The actual tracking happens in ADD_SCORE case
      return state;
    }

    case "START_NEW_ROUND": {
      // Reset eliminations and consecutive misses for all players
      const playersWithResetElimination = state.players.map((player) => ({
        ...player,
        is_eliminated: false,
        consecutive_misses: 0,
      }));

      return {
        ...state,
        players: playersWithResetElimination,
        currentRound: state.currentRound + 1,
        playersWhoScoredThisRound: new Set<number>(), // Reset who has scored
        leader: calculateLeader(playersWithResetElimination),
      };
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = action;
      void _exhaustive; // Suppress unused variable warning
      return state;
    }
  }
}
