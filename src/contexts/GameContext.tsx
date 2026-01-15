/**
 * Game Context
 * Provides game state management through React Context and useReducer
 */

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  gameReducer,
  initialState,
  GameState,
  GameAction,
} from "../reducers/gameReducer";

/**
 * Context value type
 */
interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

/**
 * Game Context
 */
const GameContext = createContext<GameContextValue | undefined>(undefined);

/**
 * GameProvider props
 */
interface GameProviderProps {
  children: ReactNode;
}

/**
 * GameProvider component
 * Wraps the app and provides game state through context
 */
export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to access game state and dispatch
 * @throws Error if used outside GameProvider
 */
export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}

/**
 * Hook to access game state only
 */
export function useGameState(): GameState {
  const { state } = useGameContext();
  return state;
}

/**
 * Hook to access dispatch function only
 */
export function useGameDispatch(): React.Dispatch<GameAction> {
  const { dispatch } = useGameContext();
  return dispatch;
}
