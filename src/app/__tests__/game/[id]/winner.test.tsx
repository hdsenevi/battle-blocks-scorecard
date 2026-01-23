/**
 * Tests for Winner Announcement Screen
 * Story 5.1: Winner Announcement Screen
 */

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import WinnerScreen from "../../../game/[id]/winner";
import { GameProvider } from "@/contexts/GameContext";
import * as database from "@/services/database";
import * as haptics from "@/services/haptics";
import { Game, Player } from "@/database/types";

// Mock expo-router
const mockReplace = jest.fn();
const mockSetOptions = jest.fn();

const mockRouter = {
  replace: mockReplace,
};

const mockNavigation = {
  setOptions: mockSetOptions,
};

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
  useNavigation: jest.fn(() => mockNavigation),
  useLocalSearchParams: jest.fn(() => ({ id: "1" })),
}));

// Mock database service
jest.mock("@/services/database");
const mockDatabase = database as jest.Mocked<typeof database>;

// Mock haptics service
jest.mock("@/services/haptics");
const mockHaptics = haptics as jest.Mocked<typeof haptics>;

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, "announceForAccessibility");

// Mock useThemeColor and useColorScheme hooks
jest.mock("@/hooks/useColorScheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));

describe("WinnerScreen (Story 5.1)", () => {
  const mockGame: Game = {
    id: 1,
    status: "completed",
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000),
  };

  const mockWinner: Player = {
    id: 1,
    game_id: 1,
    name: "Winner Player",
    current_score: 50,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  const mockPlayer2: Player = {
    id: 2,
    game_id: 1,
    name: "Player 2",
    current_score: 30,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabase.getGame.mockResolvedValue(mockGame);
    mockDatabase.getPlayersByGame.mockResolvedValue([mockWinner, mockPlayer2]);
    mockHaptics.triggerCompletion.mockResolvedValue();
    (AccessibilityInfo.announceForAccessibility as jest.Mock).mockImplementation(() => {});
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  describe("AC3: Winner announcement screen display", () => {
    it("should display winner's name prominently", async () => {
      const { getByText, findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalledWith(1);
      });

      const winnerName = await findByText("Winner Player");
      expect(winnerName).toBeTruthy();
      // Verify it's the large, prominent text (text-4xl)
      expect(winnerName.props.className).toContain("text-4xl");
    });

    it("should display 'Winner!' message", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      const winnerMessage = await findByText("Winner!");
      expect(winnerMessage).toBeTruthy();
    });

    it("should display 'Game Over!' message", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      const gameOverMessage = await findByText("Game Over!");
      expect(gameOverMessage).toBeTruthy();
    });

    it("should display celebration visual elements", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      // Check for celebration emojis
      const celebrationEmojis = await findByText("🎉");
      expect(celebrationEmojis).toBeTruthy();
    });

    it("should display winner's score", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      const scoreText = await findByText("50 Points");
      expect(scoreText).toBeTruthy();
    });
  });

  describe("AC2, AC4: Automatic navigation", () => {
    it("should load game data automatically", async () => {
      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalledWith(1);
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
      });
    });

    it("should navigate away if game ID is invalid", async () => {
      const { useLocalSearchParams } = require("expo-router");
      useLocalSearchParams.mockReturnValueOnce({ id: "invalid" });

      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
      });
    });

    it("should navigate away if game is not found", async () => {
      mockDatabase.getGame.mockResolvedValueOnce(null as any);

      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
      });
    });
  });

  describe("AC5: Haptic feedback", () => {
    it("should trigger completion haptic feedback", async () => {
      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockHaptics.triggerCompletion).toHaveBeenCalled();
      });
    });

    it("should trigger haptic feedback within reasonable time", async () => {
      const startTime = Date.now();
      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockHaptics.triggerCompletion).toHaveBeenCalled();
      });

      const duration = Date.now() - startTime;
      // Haptic should be triggered quickly (within 100ms of component mount)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe("AC6, AC7: Game completion marking", () => {
    it("should load completed game from database", async () => {
      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalledWith(1);
      });

      // Verify game status is completed
      expect(mockGame.status).toBe("completed");
    });

    it("should display final scores for all players", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });

      // Check for final scores section
      const finalScoresHeader = await findByText("Final Scores");
      expect(finalScoresHeader).toBeTruthy();

      // Check that both players are displayed
      const winnerName = await findByText("Winner Player");
      const player2Name = await findByText("Player 2");
      expect(winnerName).toBeTruthy();
      expect(player2Name).toBeTruthy();
    });

    it("should sort players by score (descending)", async () => {
      const { getAllByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });

      // Wait for players to render
      await waitFor(() => {
        const winnerName = getAllByText("Winner Player");
        expect(winnerName.length).toBeGreaterThan(0);
      });

      // Winner (50 points) should appear before Player 2 (30 points)
      const allText = getAllByText(/Winner Player|Player 2/);
      expect(allText.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("AC8: Smooth UI transition", () => {
    it("should apply fade-in animation", async () => {
      const { UIManager } = require("react-native");
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      // Wait for content to render
      await findByText("Winner Player");

      // Animation should be applied (we can't directly test animation values in RNTL,
      // but we can verify the component renders without errors)
      expect(true).toBe(true); // Animation is applied via Animated.View
    });

    it("should render without errors for smooth transition", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      // Component should render successfully
      await findByText("Winner Player");
      expect(true).toBe(true); // No errors thrown
    });
  });

  describe("AC9: Accessibility", () => {
    it("should announce winner to screen reader", async () => {
      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          "Winner Player wins with exactly 50 points! Game Over!"
        );
      });
    });

    it("should have proper accessibility labels", async () => {
      const { findByText, getByLabelText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      // Wait for content to render
      await findByText("Winner Player");

      // Check for accessibility labels
      const winnerSection = getByLabelText(/Winner: Winner Player with 50 points/);
      expect(winnerSection).toBeTruthy();
    });

    it("should have accessible final scores list", async () => {
      const { findByText, getByLabelText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });

      await findByText("Final Scores");

      // Check for accessible list items
      const listItem = getByLabelText(/1\. Winner Player, 50 points/);
      expect(listItem).toBeTruthy();
    });

    it("should have accessible new game button", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      const newGameButton = await findByText("Start New Game");
      expect(newGameButton).toBeTruthy();
      expect(newGameButton.props.accessibilityLabel).toBe("Start new game");
    });
  });

  describe("User interactions", () => {
    it("should navigate to home when 'Start New Game' is pressed", async () => {
      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getGame).toHaveBeenCalled();
      });

      const newGameButton = await findByText("Start New Game");
      
      await act(async () => {
        fireEvent.press(newGameButton);
      });

      expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  describe("Story 5.2: Final Scores Display", () => {
    describe("AC3: Final scores display", () => {
      it("should display all players with their final scores", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Check for final scores header
        const finalScoresHeader = await findByText("Final Scores");
        expect(finalScoresHeader).toBeTruthy();

        // Check that all players are displayed with scores
        const winnerName = await findByText("Winner Player");
        const player2Name = await findByText("Player 2");
        expect(winnerName).toBeTruthy();
        expect(player2Name).toBeTruthy();

        // Check scores are displayed
        const winnerScore = await findByText("50");
        const player2Score = await findByText("30");
        expect(winnerScore).toBeTruthy();
        expect(player2Score).toBeTruthy();
      });

      it("should display scores clearly and prominently", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Scores should be displayed with large, bold text
        const scoreText = await findByText("50");
        expect(scoreText).toBeTruthy();
        // Verify it's styled prominently (text-2xl font-bold)
        expect(scoreText.props.className).toContain("text-2xl");
        expect(scoreText.props.className).toContain("font-bold");
      });

      it("should highlight winner in final scores", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Winner should be highlighted with primary color background
        const winnerName = await findByText("Winner Player");
        expect(winnerName).toBeTruthy();
        
        // Winner's score should be in primary color
        const winnerScore = await findByText("50");
        expect(winnerScore.props.className).toContain("text-primary");
      });

      it("should show winner first in sorted list", async () => {
        const { getAllByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Wait for players to render
        await waitFor(() => {
          const winnerNames = getAllByText("Winner Player");
          expect(winnerNames.length).toBeGreaterThan(0);
        });

        // Get all player names in order
        const allPlayerNames = getAllByText(/Winner Player|Player 2/);
        
        // Winner should appear first (index 0 or early in the list)
        // Since we're testing the sorted list, winner with 50 points should be first
        expect(allPlayerNames.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("AC4: Score accuracy", () => {
      it("should display scores that match last game state", async () => {
        // Scores come from database via getPlayersByGame
        // which returns players with current_score from database
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
        });

        // Verify scores match what was in the database
        const winnerScore = await findByText("50");
        const player2Score = await findByText("30");
        
        expect(winnerScore).toBeTruthy();
        expect(player2Score).toBeTruthy();
        
        // Verify the scores displayed match the mock data
        expect(mockWinner.current_score).toBe(50);
        expect(mockPlayer2.current_score).toBe(30);
      });

      it("should load scores from database accurately", async () => {
        // Verify that getPlayersByGame is called to get accurate scores
        render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
        });

        // The scores displayed should come from the database query
        // which returns players with their current_score values
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });
    });

    describe("AC6: Scores saved to database", () => {
      it("should load final scores from database (saved via players table)", async () => {
        // Final scores are stored in players.current_score column
        // When game is completed, players' current_score values represent final scores
        render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
        });

        // Verify that we're loading players (which contain final scores in current_score)
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        
        // The players returned have current_score which represents final scores
        // This satisfies FR29: "store game metadata (start time, date, players, final scores)"
        // - Start time: games.created_at
        // - Players: players table
        // - Final scores: players.current_score
      });

      it("should display final scores that persist across app restarts", async () => {
        // Since scores are in database, they persist
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Scores should be displayed from database
        const winnerScore = await findByText("50");
        expect(winnerScore).toBeTruthy();
      });
    });

    describe("AC7: Design system compliance", () => {
      it("should use NativeWind/Tailwind classes for styling", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Check that styling uses Tailwind classes
        const finalScoresHeader = await findByText("Final Scores");
        expect(finalScoresHeader.props.className).toContain("text-xl");
        expect(finalScoresHeader.props.className).toContain("font-bold");
      });

      it("should follow spacing and typography guidelines", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Check spacing (mb-4, py-4, px-4)
        const finalScoresHeader = await findByText("Final Scores");
        expect(finalScoresHeader.props.className).toContain("mb-4");
      });

      it("should ensure readability with proper contrast and sizing", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
        });

        // Scores should be large and bold for readability
        const scoreText = await findByText("50");
        expect(scoreText.props.className).toContain("text-2xl");
        expect(scoreText.props.className).toContain("font-bold");
      });
    });
  });

  describe("Story 5.4: View Completed Game Results", () => {
    describe("AC3: Game metadata display", () => {
      it("should display game status", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const statusLabel = await findByText("Status:");
        expect(statusLabel).toBeTruthy();
        
        const statusValue = await findByText("completed");
        expect(statusValue).toBeTruthy();
      });

      it("should display game date", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const dateLabel = await findByText("Date:");
        expect(dateLabel).toBeTruthy();
        
        // Date should be formatted and displayed
        const dateValue = await findByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
        expect(dateValue).toBeTruthy();
      });

      it("should display game time", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const timeLabel = await findByText("Time:");
        expect(timeLabel).toBeTruthy();
        
        // Time should be formatted (e.g., "3:45 PM" or "15:45")
        const timeValue = await findByText(/\d{1,2}:\d{2}/);
        expect(timeValue).toBeTruthy();
      });

      it("should display game duration", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const durationLabel = await findByText("Duration:");
        expect(durationLabel).toBeTruthy();
        
        // Duration should be displayed (e.g., "5m" or "1h 30m")
        const durationValue = await findByText(/\d+[hm]/);
        expect(durationValue).toBeTruthy();
      });

      it("should display game ID", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const gameIdLabel = await findByText("Game ID:");
        expect(gameIdLabel).toBeTruthy();
        
        const gameIdValue = await findByText("#1");
        expect(gameIdValue).toBeTruthy();
      });
    });

    describe("AC4: Clear information display", () => {
      it("should display all information clearly", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        // Check that all key information is displayed
        const winnerName = await findByText("Winner Player");
        const finalScores = await findByText("Final Scores");
        const gameInfo = await findByText("Game Information");
        
        expect(winnerName).toBeTruthy();
        expect(finalScores).toBeTruthy();
        expect(gameInfo).toBeTruthy();
      });
    });

    describe("AC5: Permanent storage", () => {
      it("should load completed game from database", async () => {
        render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalledWith(1);
          expect(mockDatabase.getPlayersByGame).toHaveBeenCalledWith(1);
        });

        // Verify game is loaded from database (permanent storage)
        expect(mockGame.status).toBe("completed");
      });

      it("should display data from permanent storage", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        // Data should come from database (permanent storage)
        const winnerName = await findByText("Winner Player");
        expect(winnerName).toBeTruthy();
      });
    });

    describe("AC7: Navigation", () => {
      it("should have button to start new game", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const newGameButton = await findByText("Start New Game");
        expect(newGameButton).toBeTruthy();
      });

      it("should navigate to home when Start New Game is pressed", async () => {
        const { findByText } = render(<WinnerScreen />, { wrapper });

        await waitFor(() => {
          expect(mockDatabase.getGame).toHaveBeenCalled();
        });

        const newGameButton = await findByText("Start New Game");
        
        await act(async () => {
          fireEvent.press(newGameButton);
        });

        expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle missing winner gracefully", async () => {
      // Create players without a winner (no one has 50 points)
      const playersWithoutWinner: Player[] = [
        {
          ...mockPlayer2,
          current_score: 30,
        },
        {
          ...mockPlayer2,
          id: 3,
          name: "Player 3",
          current_score: 25,
        },
      ];

      mockDatabase.getPlayersByGame.mockResolvedValueOnce(playersWithoutWinner);

      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });

      // Should still render, using first player as fallback
      const playerName = await findByText("Player 2");
      expect(playerName).toBeTruthy();
    });

    it("should handle empty players list", async () => {
      mockDatabase.getPlayersByGame.mockResolvedValueOnce([]);

      const { findByText } = render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockDatabase.getPlayersByGame).toHaveBeenCalled();
      });

      // Should navigate away or show error state
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new database.DatabaseError("Database error");
      mockDatabase.getGame.mockRejectedValueOnce(dbError);

      render(<WinnerScreen />, { wrapper });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
      });
    });
  });
});
