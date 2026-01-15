/**
 * App Lifecycle Hook
 * Handles app lifecycle events (backgrounding, foregrounding, termination)
 * to automatically save and restore game state
 */

import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useGameContext } from "../contexts/GameContext";
import {
  listActiveGames,
  getGame,
  getPlayersByGame,
  updateGame,
  DatabaseError,
} from "../services/database";
import { resumeGameAction } from "../reducers/actionCreators";

/**
 * Hook to handle app lifecycle events
 * Saves game state on background/termination
 * Restores game state on foreground/start
 */
export function useAppLifecycle() {
  const { state, dispatch } = useGameContext();
  const appState = useRef(AppState.currentState);
  const isRestoringRef = useRef(false);

  /**
   * Save current game state to database
   */
  const saveGameState = async () => {
    try {
      // Only save if there's an active game
      if (!state.currentGame || state.gameStatus !== "active") {
        return;
      }

      // Update game timestamp to mark it as recently active
      await updateGame(state.currentGame.id, {
        status: state.gameStatus || "active",
      });

      // Players are already saved in database when scores are updated
      // We just need to ensure the game record is up to date
    } catch (error) {
      // Log error but don't break app flow
      if (__DEV__) {
        console.error("Failed to save game state:", error);
      }
    }
  };

  /**
   * Restore game state from database
   */
  const restoreGameState = async () => {
    // Prevent multiple simultaneous restorations
    if (isRestoringRef.current) {
      return;
    }

    try {
      isRestoringRef.current = true;

      // Check if there's already a game in state
      if (state.currentGame && state.gameStatus === "active") {
        // Game already loaded, no need to restore
        return;
      }

      // Find active games
      const activeGames = await listActiveGames();

      if (activeGames.length === 0) {
        // No active games, ensure state is clean
        return;
      }

      // Use the most recent active game (first in list, assuming sorted by created_at desc)
      const gameToRestore = activeGames[0];

      // Load game details
      const game = await getGame(gameToRestore.id);
      if (!game) {
        return;
      }

      // Load players for the game
      const players = await getPlayersByGame(game.id);

      // Restore game state to context
      dispatch(resumeGameAction(game, players));
    } catch (error) {
      // Log error but don't break app flow
      if (__DEV__) {
        console.error("Failed to restore game state:", error);
      }
    } finally {
      isRestoringRef.current = false;
    }
  };

  useEffect(() => {
    // Restore game state on app start
    restoreGameState();

    // Set up AppState listener
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        const previousAppState = appState.current;
        appState.current = nextAppState;

        // App is going to background
        if (
          previousAppState === "active" &&
          (nextAppState === "background" || nextAppState === "inactive")
        ) {
          saveGameState();
        }

        // App is coming to foreground
        if (
          (previousAppState === "background" ||
            previousAppState === "inactive") &&
          nextAppState === "active"
        ) {
          restoreGameState();
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []); // Only run on mount/unmount

  // Save game state whenever game state changes (debounced in production)
  useEffect(() => {
    // Save state when game is active and state changes
    if (state.currentGame && state.gameStatus === "active") {
      // Use a small delay to batch rapid state changes
      const timeoutId = setTimeout(() => {
        saveGameState();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [state.currentGame?.id, state.gameStatus, state.players.length]);
}
