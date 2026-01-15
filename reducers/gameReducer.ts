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
  | { type: "RESET_GAME" };

/**
 * Initial game state
 */
export const initialState: GameState = {
  currentGame: null,
  players: [],
  gameStatus: null,
  leader: null,
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
            is_eliminated: true,
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
      return {
        ...state,
        currentGame: action.payload.game,
        players: action.payload.players,
        gameStatus: action.payload.game.status,
        leader: calculateLeader(action.payload.players),
      };
    }

    case "RESET_GAME": {
      return initialState;
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = action;
      return state;
    }
  }
}
