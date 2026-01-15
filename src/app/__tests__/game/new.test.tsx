/**
 * Tests for New Game Screen
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import NewGameScreen from "../../game/new";
import { GameProvider } from "@/contexts/GameContext";
import * as database from "@/services/database";
import { Game, Player } from "@/database/types";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock database service
jest.mock("@/services/database");
const mockDatabase = database as jest.Mocked<typeof database>;

// Mock Alert
jest.spyOn(Alert, "alert");

describe("NewGameScreen", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it("should render new game screen", () => {
    const { getByText } = render(<NewGameScreen />, { wrapper });
    expect(getByText("New Game")).toBeTruthy();
    expect(getByText("Add at least 2 players to start")).toBeTruthy();
  });

  it("should add player when name is entered and add button is pressed", () => {
    const { getByPlaceholderText, getByText } = render(<NewGameScreen />, {
      wrapper,
    });

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");

    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    expect(getByText("Player 1")).toBeTruthy();
    expect(getByText("Players (1)")).toBeTruthy();
  });

  it("should show error when trying to add empty player name", () => {
    const { getByText } = render(<NewGameScreen />, { wrapper });

    const addButton = getByText("Add");
    fireEvent.press(addButton);

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a player name");
  });

  it("should remove player when remove button is pressed", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NewGameScreen />,
      { wrapper }
    );

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");

    // Add player
    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    expect(getByText("Player 1")).toBeTruthy();

    // Remove player
    const removeButton = getByText("Remove");
    fireEvent.press(removeButton);

    expect(queryByText("Player 1")).toBeNull();
  });

  it("should show error when trying to start game with less than 2 players", async () => {
    const { getByPlaceholderText, getByText } = render(<NewGameScreen />, {
      wrapper,
    });

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");
    const startButton = getByText("Start Game");

    // Add only one player
    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    // Try to start game
    fireEvent.press(startButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Not Enough Players",
      "You need at least 2 players to start a game"
    );
  });

  it("should create game and navigate when start game is pressed with 2+ players", async () => {
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
      current_score: 0,
      consecutive_misses: 0,
      is_eliminated: false,
      created_at: Math.floor(Date.now() / 1000),
    };

    const mockPlayer2: Player = {
      id: 2,
      game_id: 1,
      name: "Player 2",
      current_score: 0,
      consecutive_misses: 0,
      is_eliminated: false,
      created_at: Math.floor(Date.now() / 1000),
    };

    mockDatabase.createGame.mockResolvedValue(mockGame);
    mockDatabase.addPlayer
      .mockResolvedValueOnce(mockPlayer1)
      .mockResolvedValueOnce(mockPlayer2);

    const { getByPlaceholderText, getByText } = render(<NewGameScreen />, {
      wrapper,
    });

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");
    const startButton = getByText("Start Game");

    // Add two players
    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    fireEvent.changeText(input, "Player 2");
    fireEvent.press(addButton);

    // Start game
    fireEvent.press(startButton);

    await waitFor(() => {
      expect(mockDatabase.createGame).toHaveBeenCalledWith({ status: "active" });
    });

    await waitFor(() => {
      expect(mockDatabase.addPlayer).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/game/1");
    });
  });

  it("should show loading state while creating game", async () => {
    const mockGame: Game = {
      id: 1,
      status: "active",
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };

    const mockPlayer: Player = {
      id: 1,
      game_id: 1,
      name: "Player 1",
      current_score: 0,
      consecutive_misses: 0,
      is_eliminated: false,
      created_at: Math.floor(Date.now() / 1000),
    };

    // Create a promise that we can control
    let resolveCreateGame: (value: Game) => void;
    const createGamePromise = new Promise<Game>((resolve) => {
      resolveCreateGame = resolve;
    });

    mockDatabase.createGame.mockReturnValue(createGamePromise);
    mockDatabase.addPlayer.mockResolvedValue(mockPlayer);

    const { getByPlaceholderText, getByText, queryByText } = render(
      <NewGameScreen />,
      { wrapper }
    );

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");

    // Add two players
    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    fireEvent.changeText(input, "Player 2");
    fireEvent.press(addButton);

    const startButton = getByText("Start Game");
    fireEvent.press(startButton);

    // Should show "Creating..." text
    expect(queryByText("Creating...")).toBeTruthy();
    expect(queryByText("Start Game")).toBeNull();

    // Resolve the promise
    resolveCreateGame!(mockGame);

    await waitFor(() => {
      expect(mockDatabase.createGame).toHaveBeenCalled();
    });
  });

  it("should handle error when game creation fails", async () => {
    mockDatabase.createGame.mockRejectedValue(
      new database.DatabaseError("Database error")
    );

    const { getByPlaceholderText, getByText } = render(<NewGameScreen />, {
      wrapper,
    });

    const input = getByPlaceholderText("Enter player name");
    const addButton = getByText("Add");
    const startButton = getByText("Start Game");

    // Add two players
    fireEvent.changeText(input, "Player 1");
    fireEvent.press(addButton);

    fireEvent.changeText(input, "Player 2");
    fireEvent.press(addButton);

    // Start game
    fireEvent.press(startButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to create game: Database error"
      );
    });
  });
});
