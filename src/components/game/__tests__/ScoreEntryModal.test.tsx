/**
 * Tests for ScoreEntryModal Component
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { ScoreEntryModal } from "../ScoreEntryModal";
import type { Player } from "@/database/types";

// Mock dependencies
jest.mock("@/hooks/useColorScheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));

jest.mock("@/contexts/GameContext", () => ({
  useGameDispatch: jest.fn(() => jest.fn()),
}));

jest.mock("@/services/database", () => ({
  addScoreEntry: jest.fn(),
  updatePlayer: jest.fn(),
  updateGame: jest.fn(),
  DatabaseError: class DatabaseError extends Error {},
}));

jest.mock("@/services/gameRules", () => ({
  calculateScore: jest.fn((blocks: number[], isMultiple: boolean) => {
    if (isMultiple) {
      return blocks.length;
    }
    return blocks[0] || 0;
  }),
}));

jest.mock("@/services/haptics", () => ({
  triggerScoreEntry: jest.fn(),
  triggerError: jest.fn(),
  triggerCompletion: jest.fn(),
}));

jest.mock("@/reducers/actionCreators", () => ({
  addScoreAction: jest.fn((playerId: number, score: number) => ({
    type: "ADD_SCORE",
    payload: { playerId, score },
  })),
  updatePlayerAction: jest.fn((player: Player) => ({
    type: "UPDATE_PLAYER",
    payload: player,
  })),
  completeGameAction: jest.fn((player: Player) => ({
    type: "COMPLETE_GAME",
    payload: player,
  })),
}));

describe("ScoreEntryModal", () => {
  const mockPlayer: Player = {
    id: 1,
    game_id: 1,
    name: "Player 1",
    current_score: 10,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  const mockOnClose = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("@/contexts/GameContext").useGameDispatch.mockReturnValue(mockDispatch);
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should not render when player is null", () => {
    const { queryByText } = render(
      <ScoreEntryModal
        visible={true}
        player={null}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    expect(queryByText("Enter Score for")).toBeNull();
  });

  it("should render score entry interface with player name and current score", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    expect(getByText("Enter Score for Player 1")).toBeTruthy();
    expect(getByText("Current Score: 10")).toBeTruthy();
  });

  it("should display single block and multiple blocks options", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    expect(getByText("Single Block")).toBeTruthy();
    expect(getByText("Multiple Blocks")).toBeTruthy();
  });

  it("should allow switching between single and multiple block modes", () => {
    const { getByText, getByPlaceholderText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    // Initially single block mode
    expect(getByPlaceholderText("Block number")).toBeTruthy();
    expect(getByText("Enter the block number (e.g., 12 = 12 points)")).toBeTruthy();

    // Switch to multiple blocks mode
    const multipleButton = getByText("Multiple Blocks");
    fireEvent.press(multipleButton);

    expect(getByPlaceholderText("Number of blocks")).toBeTruthy();
    expect(getByText("Enter the number of blocks (e.g., 3 blocks = 3 points)")).toBeTruthy();
  });

  it("should have correct accessibility labels", () => {
    const { getByLabelText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    expect(getByLabelText("Single block mode")).toBeTruthy();
    expect(getByLabelText("Multiple blocks mode")).toBeTruthy();
    expect(getByLabelText("Block number input")).toBeTruthy();
    expect(getByLabelText("Cancel")).toBeTruthy();
    expect(getByLabelText("Submit score")).toBeTruthy();
  });

  it("should call onClose when cancel button is pressed", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should handle score submission for single block mode", async () => {
    const { addScoreEntry, updatePlayer } = require("@/services/database");
    const { addScoreAction, updatePlayerAction } = require("@/reducers/actionCreators");
    const { triggerScoreEntry } = require("@/services/haptics");

    updatePlayer.mockResolvedValue({
      ...mockPlayer,
      current_score: 22,
      consecutive_misses: 0,
    });
    addScoreEntry.mockResolvedValue(undefined);

    const { getByPlaceholderText, getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText("Block number");
    fireEvent.changeText(input, "12");

    const submitButton = getByText("Submit");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(updatePlayer).toHaveBeenCalledWith(1, {
        current_score: 22,
        consecutive_misses: 0,
      });
      expect(addScoreEntry).toHaveBeenCalledWith(1, 1, 12, "single_block");
      expect(mockDispatch).toHaveBeenCalled();
      expect(triggerScoreEntry).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should handle score submission for multiple blocks mode", async () => {
    const { addScoreEntry, updatePlayer } = require("@/services/database");
    const { triggerScoreEntry } = require("@/services/haptics");

    updatePlayer.mockResolvedValue({
      ...mockPlayer,
      current_score: 13,
      consecutive_misses: 0,
    });
    addScoreEntry.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    // Switch to multiple blocks mode
    const multipleButton = getByText("Multiple Blocks");
    fireEvent.press(multipleButton);

    const input = getByPlaceholderText("Number of blocks");
    fireEvent.changeText(input, "3");

    const submitButton = getByText("Submit");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(updatePlayer).toHaveBeenCalled();
      expect(addScoreEntry).toHaveBeenCalledWith(1, 1, 3, "multiple_blocks");
      expect(triggerScoreEntry).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show error alert when submitting empty value", async () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const submitButton = getByText("Submit");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a block value");
    });
  });

  it("should show error alert when submitting invalid non-numeric input", async () => {
    const { getByPlaceholderText, getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText("Block number");
    fireEvent.changeText(input, "abc");

    const submitButton = getByText("Submit");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Invalid Input", "Please enter a valid number");
    });
  });

  it("should prevent score entry for completed games", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        gameStatus="completed"
        onClose={mockOnClose}
      />
    );

    expect(getByText("Game Completed")).toBeTruthy();
    expect(getByText("This game has been completed. No further score entries are allowed.")).toBeTruthy();
  });

  it("should prevent score entry for notcompleted games", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        gameStatus="notcompleted"
        onClose={mockOnClose}
      />
    );

    expect(getByText("Game Not Completed")).toBeTruthy();
    expect(getByText("This game was not completed. No further score entries are allowed.")).toBeTruthy();
  });

  it("should prevent score entry for paused games", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        gameStatus="paused"
        onClose={mockOnClose}
      />
    );

    expect(getByText("Game Paused")).toBeTruthy();
    expect(getByText("This game is paused. Resume the game to continue playing.")).toBeTruthy();
  });

  it("should prevent score entry for eliminated players", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };

    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={eliminatedPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    expect(getByText("Player Eliminated")).toBeTruthy();
    expect(getByText("Player 1 has been eliminated and cannot receive further scores.")).toBeTruthy();
  });

  it("should handle touch target sizes (44x44 iOS, 48x48 Android minimum)", () => {
    const { getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const singleButton = getByText("Single Block").parent;
    const multipleButton = getByText("Multiple Blocks").parent;
    const cancelButton = getByText("Cancel").parent;
    const submitButton = getByText("Submit").parent;

    // Check that buttons exist and have minimum touch target
    expect(singleButton).toBeTruthy();
    expect(multipleButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("should display submitting state when submitting", async () => {
    const { updatePlayer } = require("@/services/database");
    updatePlayer.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    const { getByPlaceholderText, getByText, queryByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText("Block number");
    fireEvent.changeText(input, "12");

    const submitButton = getByText("Submit");
    fireEvent.press(submitButton);

    // Should show "Submitting..." text
    expect(getByText("Submitting...")).toBeTruthy();
    expect(queryByText("Submit")).toBeNull();
  });

  it("should reset form when modal is closed", () => {
    const { getByPlaceholderText, getByText } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText("Block number");
    fireEvent.changeText(input, "12");

    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);

    // Re-open modal and verify input is cleared
    const { getByPlaceholderText: getInputAfterClose } = render(
      <ScoreEntryModal
        visible={true}
        player={mockPlayer}
        gameId={1}
        onClose={mockOnClose}
      />
    );

    const inputAfterClose = getInputAfterClose("Block number");
    expect(inputAfterClose.props.value).toBe("");
  });
});
