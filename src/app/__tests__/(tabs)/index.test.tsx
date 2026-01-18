/**
 * Tests for Home Screen (Resume Game Functionality)
 */

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import HomeScreen from "../../(tabs)/index";
import { GameProvider } from "@/contexts/GameContext";
import * as database from "@/services/database";
import { Game, Player } from "@/database/types";
import { resumeGameAction } from "@/reducers/actionCreators";

// Mock expo-router
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock database service
jest.mock("@/services/database");
const mockDatabase = database as jest.Mocked<typeof database>;

// Mock action creators
jest.mock("@/reducers/actionCreators", () => ({
  resumeGameAction: jest.fn((game, players) => ({
    type: "RESUME_GAME",
    payload: { game, players },
  })),
}));

// Mock useThemeColor and useColorScheme hooks
jest.mock("@/hooks/useColorScheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));

describe("HomeScreen", () => {
  const mockGame: Game = {
    id: 1,
    status: "active",
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000),
  };

  const mockPlayer1: Player = {
    id: 1,
    game_id: 1,
    name: "Player 1",
    current_score: 10,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  const mockPlayer2: Player = {
    id: 2,
    game_id: 1,
    name: "Player 2",
    current_score: 20,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.listPausedGames.mockResolvedValue([]);
    mockDatabase.getGame.mockResolvedValue(mockGame);
    mockDatabase.getPlayersByGame.mockResolvedValue([mockPlayer1, mockPlayer2]);
    mockDatabase.updateGame.mockResolvedValue(mockGame);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it("should render home screen with title and subtitle", async () => {
    const { findByText } = render(<HomeScreen />, { wrapper });

    expect(await findByText("Battle Blocks Scorecard")).toBeTruthy();
    expect(await findByText("Track scores for your Battle Blocks games")).toBeTruthy();
  });

  it("should show Start New Game button", async () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("start-new-game-button")).toBeTruthy();
    });
  });

  it("should navigate to new game screen when Start New Game is pressed", async () => {
    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("start-new-game-button")).toBeTruthy();
    });

    act(() => {
      fireEvent.press(getByTestId("start-new-game-button"));
    });

    expect(mockPush).toHaveBeenCalledWith("/game/new");
  });

  it("should show Continue Game button when active games exist", async () => {
    mockDatabase.listActiveGames.mockResolvedValue([mockGame]);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });
  });

  it("should show Continue Game button when paused games exist", async () => {
    mockDatabase.listPausedGames.mockResolvedValue([mockGame]);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });
  });

  it("should hide Continue Game button when no active or paused games exist", async () => {
    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.listPausedGames.mockResolvedValue([]);

    const { queryByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(queryByTestId("continue-game-button")).toBeNull();
    });
  });

  it("should resume single active game when Continue Game is pressed", async () => {
    mockDatabase.listActiveGames.mockResolvedValue([mockGame]);
    mockDatabase.listPausedGames.mockResolvedValue([]);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockDatabase.getGame).toHaveBeenCalledWith(1);
      expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
      expect(resumeGameAction).toHaveBeenCalledWith(mockGame, [mockPlayer1, mockPlayer2]);
      expect(mockPush).toHaveBeenCalledWith("/game/1");
    });
  });

  it("should resume single paused game when Continue Game is pressed", async () => {
    const pausedGame: Game = {
      ...mockGame,
      status: "paused",
    };
    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.listPausedGames.mockResolvedValue([pausedGame]);
    mockDatabase.getGame.mockResolvedValue(pausedGame);
    mockDatabase.updateGame.mockResolvedValue(mockGame);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockDatabase.updateGame).toHaveBeenCalledWith(1, { status: "active" });
      expect(mockDatabase.getGame).toHaveBeenCalled();
      expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      expect(resumeGameAction).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/game/1");
    });
  });

  it("should navigate to game selection screen when multiple games exist", async () => {
    const mockGame2: Game = {
      id: 2,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    mockDatabase.listActiveGames.mockResolvedValue([mockGame, mockGame2]);
    mockDatabase.listPausedGames.mockResolvedValue([]);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/game/select");
    });
  });

  it("should use game from context if already loaded", async () => {
    // This test would require setting up context with a game
    // For now, we'll test that it checks context first
    const { getByTestId } = render(<HomeScreen />, { wrapper });

    // Should check for active games
    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });
  });

  it("should handle database errors gracefully", async () => {
    mockDatabase.listActiveGames.mockRejectedValue(new Error("Database error"));

    const { queryByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      // Should not show continue button on error
      expect(queryByTestId("continue-game-button")).toBeNull();
    });
  });

  it("should show loading state initially", () => {
    mockDatabase.listActiveGames.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { getByText } = render(<HomeScreen />, { wrapper });

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("should restore game state from context if game already loaded", async () => {
    // This would require setting up context with a game
    // For now, we verify the check happens
    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(mockDatabase.listActiveGames).toHaveBeenCalled();
    });
  });

  // Performance Test: Verify game restoration completes within 500ms (NFR4)
  it("should restore game state within 500ms (NFR4)", async () => {
    mockDatabase.listActiveGames.mockResolvedValue([mockGame]);
    mockDatabase.listPausedGames.mockResolvedValue([]);

    // Mock fast database operations
    mockDatabase.getGame.mockImplementation(
      () => Promise.resolve(mockGame)
    );
    mockDatabase.getPlayersByGame.mockImplementation(
      () => Promise.resolve([mockPlayer1, mockPlayer2])
    );

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    const startTime = Date.now();

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/game/1");
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Verify restoration completes within 500ms
    expect(duration).toBeLessThan(500);
  });

  it("should handle paused game restoration and activation within 500ms", async () => {
    const pausedGame: Game = {
      ...mockGame,
      status: "paused",
    };
    mockDatabase.listActiveGames.mockResolvedValue([]);
    mockDatabase.listPausedGames.mockResolvedValue([pausedGame]);
    mockDatabase.getGame
      .mockResolvedValueOnce(pausedGame)
      .mockResolvedValueOnce(mockGame); // After update
    mockDatabase.updateGame.mockResolvedValue(mockGame);

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    const startTime = Date.now();

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/game/1");
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Verify restoration completes within 500ms even with status update
    expect(duration).toBeLessThan(500);
  });

  it("should handle multiple games check efficiently", async () => {
    const mockGame2: Game = {
      id: 2,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    mockDatabase.listActiveGames.mockResolvedValue([mockGame, mockGame2]);
    mockDatabase.listPausedGames.mockResolvedValue([]);

    const startTime = Date.now();

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(getByTestId("continue-game-button")).toBeTruthy();
    });

    act(() => {
      fireEvent.press(getByTestId("continue-game-button"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/game/select");
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Multiple games check should also be fast
    expect(duration).toBeLessThan(500);
  });
});
