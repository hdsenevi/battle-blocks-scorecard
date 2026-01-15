/**
 * Game Context Tests
 * Tests for GameContext provider and hooks
 */

import React from "react";
import { render, renderHook } from "@testing-library/react-native";
import {
  GameProvider,
  useGameContext,
  useGameState,
  useGameDispatch,
} from "../GameContext";
import { startGameAction } from "../../reducers/actionCreators";
import type { Game } from "../../database/types";

describe("GameContext", () => {
  describe("GameProvider", () => {
    it("should provide state and dispatch to children", () => {
      const TestComponent = () => {
        const { state, dispatch } = useGameContext();
        return (
          <>
            <div testID="state">{JSON.stringify(state)}</div>
            <div testID="dispatch">{dispatch ? "dispatch" : "no-dispatch"}</div>
          </>
        );
      };

      const { getByTestId } = render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      );

      expect(getByTestId("state")).toBeTruthy();
      expect(getByTestId("dispatch").props.children).toBe("dispatch");
    });

    it("should initialize with initial state", () => {
      const { result } = renderHook(() => useGameState(), {
        wrapper: GameProvider,
      });

      expect(result.current.currentGame).toBeNull();
      expect(result.current.players).toEqual([]);
      expect(result.current.gameStatus).toBeNull();
      expect(result.current.leader).toBeNull();
    });
  });

  describe("useGameContext", () => {
    it("should throw error when used outside provider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useGameContext());
      }).toThrow("useGameContext must be used within a GameProvider");

      console.error = originalError;
    });

    it("should return state and dispatch when used inside provider", () => {
      const { result } = renderHook(() => useGameContext(), {
        wrapper: GameProvider,
      });

      expect(result.current.state).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
      expect(typeof result.current.dispatch).toBe("function");
    });
  });

  describe("useGameState", () => {
    it("should return current game state", () => {
      const { result } = renderHook(() => useGameState(), {
        wrapper: GameProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.currentGame).toBeNull();
      expect(result.current.players).toEqual([]);
    });

    it("should return updated state after dispatch", () => {
      const { result } = renderHook(
        () => {
          const state = useGameState();
          const dispatch = useGameDispatch();
          return { state, dispatch };
        },
        {
          wrapper: GameProvider,
        }
      );

      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      result.current.dispatch(startGameAction(game));

      expect(result.current.state.currentGame).toEqual(game);
      expect(result.current.state.gameStatus).toBe("active");
    });
  });

  describe("useGameDispatch", () => {
    it("should return dispatch function", () => {
      const { result } = renderHook(() => useGameDispatch(), {
        wrapper: GameProvider,
      });

      expect(typeof result.current).toBe("function");
    });

    it("should dispatch actions that update state", () => {
      const { result: stateResult } = renderHook(() => useGameState(), {
        wrapper: GameProvider,
      });

      const { result: dispatchResult } = renderHook(() => useGameDispatch(), {
        wrapper: GameProvider,
      });

      const game: Game = {
        id: 1,
        status: "active",
        created_at: 1000,
        updated_at: 1000,
      };

      dispatchResult.current(startGameAction(game));

      expect(stateResult.current.currentGame).toEqual(game);
    });
  });
});
