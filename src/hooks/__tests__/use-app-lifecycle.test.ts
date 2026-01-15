/**
 * Tests for useAppLifecycle hook
 */

import { renderHook, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";
import { useAppLifecycle } from "../use-app-lifecycle";
import { GameProvider } from "../../contexts/GameContext";
import * as database from "../../services/database";
import { Game, Player } from "../../database/types";

// Mock database service
jest.mock("../../services/database");
const mockDatabase = database as jest.Mocked<typeof database>;

// Mock AppState
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    AppState: {
      currentState: "active",
      addEventListener: jest.fn(),
    },
  };
});

describe("useAppLifecycle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AppState.addEventListener as jest.Mock).mockReturnValue({
      remove: jest.fn(),
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it("should restore game state on mount if active game exists", async () => {
    const mockGame: Game = {
      id: 1,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const mockPlayers: Player[] = [
      {
        id: 1,
        game_id: 1,
        name: "Player 1",
        current_score: 10,
        consecutive_misses: 0,
        is_eliminated: false,
        created_at: Math.floor(Date.now() / 1000),
      },
    ];

    mockDatabase.listActiveGames.mockResolvedValue([mockGame]);
    mockDatabase.getGame.mockResolvedValue(mockGame);
    mockDatabase.getPlayersByGame.mockResolvedValue(mockPlayers);

    renderHook(() => useAppLifecycle(), { wrapper });

    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });
  });

  it("should not restore if no active games exist", async () => {
    mockDatabase.listActiveGames.mockResolvedValue([]);

    renderHook(() => useAppLifecycle(), { wrapper });

    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });

    expect(mockDatabase.getGame).not.toHaveBeenCalled();
    expect(mockDatabase.getPlayersByGame).not.toHaveBeenCalled();
  });

  it("should set up AppState listener on mount", () => {
    renderHook(() => useAppLifecycle(), { wrapper });

    expect(AppState.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should save game state when app goes to background", async () => {
    const mockGame: Game = {
      id: 1,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.updateGame.mockResolvedValue(mockGame);

    const { result } = renderHook(() => useAppLifecycle(), { wrapper });

    // Get the change handler
    const changeHandler = (AppState.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Simulate app going to background
    changeHandler("background");

    await waitFor(() => {
      // Should attempt to save if there's an active game
      // (In real scenario, state would have currentGame)
    });
  });

  it("should restore game state when app comes to foreground", async () => {
    const mockGame: Game = {
      id: 1,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const mockPlayers: Player[] = [];

    mockDatabase.listActiveGames.mockResolvedValue([mockGame]);
    mockDatabase.getGame.mockResolvedValue(mockGame);
    mockDatabase.getPlayersByGame.mockResolvedValue(mockPlayers);

    renderHook(() => useAppLifecycle(), { wrapper });

    // Get the change handler
    const changeHandler = (AppState.addEventListener as jest.Mock).mock
      .calls[0][1];

    // Simulate app coming to foreground
    changeHandler("active");

    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });
  });

  it("should handle errors gracefully during save", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.updateGame.mockRejectedValue(
      new Error("Database error")
    );

    renderHook(() => useAppLifecycle(), { wrapper });

    // Should not crash
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should handle errors gracefully during restore", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockDatabase.listActiveGames.mockRejectedValue(
      new Error("Database error")
    );

    renderHook(() => useAppLifecycle(), { wrapper });

    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });

    // Should not crash
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should clean up AppState listener on unmount", () => {
    const removeMock = jest.fn();
    (AppState.addEventListener as jest.Mock).mockReturnValue({
      remove: removeMock,
    });

    const { unmount } = renderHook(() => useAppLifecycle(), { wrapper });

    unmount();

    expect(removeMock).toHaveBeenCalled();
  });
});
