/**
 * Game Reducer Tests
 * Tests for game state reducer and immutability
 */

import { gameReducer, initialState } from "../gameReducer";
import type { Game, Player } from "../../database/types";
import {
  startGameAction,
  addPlayerAction,
  addScoreAction,
  applyPenaltyAction,
  eliminatePlayerAction,
  updatePlayerAction,
  completeGameAction,
  resumeGameAction,
  resetGameAction,
  undoLastScoreAction,
} from "../actionCreators";

describe("gameReducer", () => {
  describe("START_GAME", () => {
    it("should set current game and reset players", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const action = startGameAction(game);
      const newState = gameReducer(initialState, action);

      expect(newState.currentGame).toEqual(game);
      expect(newState.players).toEqual([]);
      expect(newState.gameStatus).toBe("active");
      expect(newState.leader).toBeNull();
    });

    it("should not mutate original state", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const action = startGameAction(game);
      const originalState = { ...initialState };
      gameReducer(initialState, action);

      expect(initialState).toEqual(originalState);
    });
  });

  describe("ADD_PLAYER", () => {
    it("should add player to players array", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 0,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));

      expect(state.players).toHaveLength(1);
      expect(state.players[0]).toEqual(player);
      expect(state.leader).toEqual(player);
    });

    it("should update leader when adding player", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player1: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      const player2: Player = {
        id: 2,
        game_id: 1,
        name: "Player 2",
        current_score: 5,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player1));
      state = gameReducer(state, addPlayerAction(player2));

      expect(state.leader).toEqual(player1);
    });

    it("should not mutate original players array", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 0,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      const originalPlayers = [...state.players];
      gameReducer(state, addPlayerAction(player));

      expect(state.players).toEqual(originalPlayers);
    });
  });

  describe("ADD_SCORE", () => {
    it("should add score to player and reset consecutive misses", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 2,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, addScoreAction(1, 5));

      expect(state.players[0].current_score).toBe(15);
      expect(state.players[0].consecutive_misses).toBe(0);
    });

    it("should update leader when score changes", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player1: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      const player2: Player = {
        id: 2,
        game_id: 1,
        name: "Player 2",
        current_score: 15,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player1));
      state = gameReducer(state, addPlayerAction(player2));
      expect(state.leader).toEqual(player2);

      state = gameReducer(state, addScoreAction(1, 10));
      expect(state.leader).toEqual(state.players[0]);
      expect(state.leader?.current_score).toBe(20);
    });

    it("should not mutate original player objects", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      const originalPlayer = { ...state.players[0] };
      gameReducer(state, addScoreAction(1, 5));

      expect(state.players[0]).toEqual(originalPlayer);
    });
  });

  describe("APPLY_PENALTY", () => {
    it("should add penalty to player score", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, applyPenaltyAction(1, 50));

      expect(state.players[0].current_score).toBe(60);
    });
  });

  describe("ELIMINATE_PLAYER", () => {
    it("should mark player as eliminated", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, eliminatePlayerAction(1));

      expect(state.players[0].is_eliminated).toBe(true);
      expect(state.leader).toBeNull();
    });
  });

  describe("UPDATE_PLAYER", () => {
    it("should update player in array", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      const updatedPlayer: Player = {
        ...player,
        current_score: 20,
        consecutive_misses: 2,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, updatePlayerAction(updatedPlayer));

      expect(state.players[0]).toEqual(updatedPlayer);
    });
  });

  describe("COMPLETE_GAME", () => {
    it("should set game status to completed and set winner", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const winner: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 50,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(winner));
      state = gameReducer(state, completeGameAction(winner));

      expect(state.gameStatus).toBe("completed");
      expect(state.leader).toEqual(winner);
      expect(state.currentGame?.status).toBe("completed");
    });

    it("should handle null winner", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, completeGameAction(null));

      expect(state.gameStatus).toBe("completed");
      expect(state.leader).toBeNull();
    });
  });

  describe("RESUME_GAME", () => {
    it("should restore game state from saved data", () => {
      const game: Game = {
        id: 1,
        status: "paused",
        created_at: 1000,
        updated_at: 1000,
      };

      const players: Player[] = [
        {
          id: 1,
          game_id: 1,
          name: "Player 1",
          current_score: 20,
          consecutive_misses: 0,
          is_eliminated: false,
          created_at: 1000,
        },
        {
          id: 2,
          game_id: 1,
          name: "Player 2",
          current_score: 15,
          consecutive_misses: 1,
          is_eliminated: false,
          created_at: 1000,
        },
      ];

      const state = gameReducer(
        initialState,
        resumeGameAction(game, players)
      );

      expect(state.currentGame).toEqual(game);
      expect(state.players).toEqual(players);
      expect(state.gameStatus).toBe("paused");
      expect(state.leader).toEqual(players[0]);
    });
  });

  describe("RESET_GAME", () => {
    it("should reset state to initial state", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, resetGameAction());

      expect(state).toEqual(initialState);
    });
  });

  describe("Leader calculation", () => {
    it("should return null leader when there's a tie", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player1: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 20,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      const player2: Player = {
        id: 2,
        game_id: 1,
        name: "Player 2",
        current_score: 20,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player1));
      state = gameReducer(state, addPlayerAction(player2));

      expect(state.leader).toBeNull();
    });

    it("should exclude eliminated players from leader calculation", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player1: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 30,
        consecutive_misses: 0,
        is_eliminated: true,
        created_at: 1000,
      };

      const player2: Player = {
        id: 2,
        game_id: 1,
        name: "Player 2",
        current_score: 20,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player1));
      state = gameReducer(state, addPlayerAction(player2));

      expect(state.leader).toEqual(player2);
    });
  });

  describe("UNDO_LAST_SCORE", () => {
    it("should restore player score and remove from playersWhoScoredThisRound", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 15,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, addScoreAction(1, 5)); // Score becomes 20, added to playersWhoScoredThisRound

      expect(state.players[0].current_score).toBe(20);
      expect(state.playersWhoScoredThisRound.has(1)).toBe(true);

      // Undo the score
      state = gameReducer(
        state,
        undoLastScoreAction(1, 15, 0, false, false)
      );

      expect(state.players[0].current_score).toBe(15);
      expect(state.playersWhoScoredThisRound.has(1)).toBe(false);
    });

    it("should restore consecutive_misses when undoing a miss", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 2,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      // Simulate a miss (consecutive_misses would be incremented to 3)
      const updatedPlayer = {
        ...player,
        consecutive_misses: 3,
      };
      state = gameReducer(state, updatePlayerAction(updatedPlayer));

      expect(state.players[0].consecutive_misses).toBe(3);

      // Undo the miss
      state = gameReducer(
        state,
        undoLastScoreAction(1, 10, 2, false, false)
      );

      expect(state.players[0].consecutive_misses).toBe(2);
    });

    it("should restore is_eliminated state", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, eliminatePlayerAction(1));

      expect(state.players[0].is_eliminated).toBe(true);

      // Undo (restore elimination state)
      state = gameReducer(
        state,
        undoLastScoreAction(1, 10, 0, false, false)
      );

      expect(state.players[0].is_eliminated).toBe(false);
    });

    it("should revert game status from completed to active", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 50,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, completeGameAction(player));

      expect(state.gameStatus).toBe("completed");
      expect(state.currentGame?.status).toBe("completed");

      // Undo (revert game completion)
      state = gameReducer(
        state,
        undoLastScoreAction(1, 45, 0, false, true)
      );

      expect(state.gameStatus).toBe("active");
      expect(state.currentGame?.status).toBe("active");
    });

    it("should recalculate leader after undo", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player1: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 20,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      const player2: Player = {
        id: 2,
        game_id: 1,
        name: "Player 2",
        current_score: 15,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player1));
      state = gameReducer(state, addPlayerAction(player2));
      state = gameReducer(state, addScoreAction(1, 5)); // Player 1 now has 25

      expect(state.leader?.id).toBe(1);

      // Undo Player 1's score
      state = gameReducer(
        state,
        undoLastScoreAction(1, 20, 0, false, false)
      );

      expect(state.leader?.id).toBe(1); // Still leader, but with 20 points
      expect(state.players[0].current_score).toBe(20);
    });

    it("should not mutate original state", () => {
      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      const player: Player = {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 15,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: 1000,
      };

      let state = gameReducer(initialState, startGameAction(game));
      state = gameReducer(state, addPlayerAction(player));
      state = gameReducer(state, addScoreAction(1, 5));

      const originalState = { ...state };
      const originalPlayersWhoScored = new Set(state.playersWhoScoredThisRound);

      state = gameReducer(
        state,
        undoLastScoreAction(1, 15, 0, false, false)
      );

      expect(originalState.players[0].current_score).toBe(20);
      expect(originalPlayersWhoScored.has(1)).toBe(true);
    });
  });
});
