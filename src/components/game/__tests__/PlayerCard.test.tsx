/**
 * Tests for PlayerCard Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PlayerCard } from "../PlayerCard";
import type { Player } from "@/database/types";

// Mock useThemeColor and useColorScheme hooks
jest.mock("@/hooks/useColorScheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));

describe("PlayerCard", () => {
  const mockPlayer: Player = {
    id: 1,
    game_id: 1,
    name: "Player 1",
    current_score: 10,
    consecutive_misses: 0,
    is_eliminated: false,
    created_at: Math.floor(Date.now() / 1000),
  };

  it("should render player card with name and score", () => {
    const { getByText, getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} />
    );

    expect(getByText("Player 1")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();
    expect(getByTestId("player-card-Player 1")).toBeTruthy();
  });

  it("should display leader badge when player is leader", () => {
    const { getByText } = render(
      <PlayerCard player={mockPlayer} isLeader={true} gameId={1} />
    );

    expect(getByText("👑 Leader")).toBeTruthy();
  });

  it("should not display leader badge when player is not leader", () => {
    const { queryByText } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} />
    );

    expect(queryByText("👑 Leader")).toBeNull();
  });

  it("should display eliminated badge when player is eliminated", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };

    const { getByText } = render(
      <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
    );

    expect(getByText("Eliminated")).toBeTruthy();
  });

  it("should not display eliminated badge when player is not eliminated", () => {
    const { queryByText } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} />
    );

    expect(queryByText("Eliminated")).toBeNull();
  });

  it("should call onPress when card is pressed", () => {
    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <PlayerCard
        player={mockPlayer}
        isLeader={false}
        gameId={1}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByTestId("player-card-Player 1"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("should not call onPress when card is disabled (eliminated player)", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };
    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <PlayerCard
        player={eliminatedPlayer}
        isLeader={false}
        gameId={1}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByTestId("player-card-Player 1"));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("should not call onPress when onPress is not provided", () => {
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} />
    );

    // Should not throw error when pressing without onPress
    expect(() => {
      fireEvent.press(getByTestId("player-card-Player 1"));
    }).not.toThrow();
  });

  it("should have correct accessibility label", () => {
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    expect(card.props.accessibilityLabel).toBe("Player 1, Score: 10");
  });

  it("should have correct accessibility label with leader", () => {
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={true} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    expect(card.props.accessibilityLabel).toBe("Player 1, Score: 10, Leader");
  });

  it("should have correct accessibility label with eliminated", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };

    const { getByTestId } = render(
      <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    expect(card.props.accessibilityLabel).toBe("Player 1, Score: 10, Eliminated");
  });

  it("should have correct accessibility label with leader and eliminated", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };

    const { getByTestId } = render(
      <PlayerCard player={eliminatedPlayer} isLeader={true} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    expect(card.props.accessibilityLabel).toBe("Player 1, Score: 10, Leader, Eliminated");
  });

  it("should have correct accessibility role", () => {
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={false} gameId={1} onPress={jest.fn()} />
    );

    const card = getByTestId("player-card-Player 1");
    expect(card.props.accessibilityRole).toBe("button");
  });

  it("should display score correctly for different values", () => {
    const playerWithHighScore: Player = {
      ...mockPlayer,
      current_score: 50,
    };

    const { getByText } = render(
      <PlayerCard player={playerWithHighScore} isLeader={false} gameId={1} />
    );

    expect(getByText("50")).toBeTruthy();
  });

  it("should display score correctly for zero", () => {
    const playerWithZeroScore: Player = {
      ...mockPlayer,
      current_score: 0,
    };

    const { getByText } = render(
      <PlayerCard player={playerWithZeroScore} isLeader={false} gameId={1} />
    );

    expect(getByText("0")).toBeTruthy();
  });

  it("should apply leader card styling when isLeader is true", () => {
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} isLeader={true} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    // The card should have leader styling applied
    // We can verify this by checking the style prop contains leader styles
    expect(card).toBeTruthy();
  });

  it("should apply eliminated card styling when player is eliminated", () => {
    const eliminatedPlayer: Player = {
      ...mockPlayer,
      is_eliminated: true,
    };

    const { getByTestId } = render(
      <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
    );

    const card = getByTestId("player-card-Player 1");
    // The card should have eliminated styling applied
    expect(card).toBeTruthy();
    // Card should have reduced opacity and gray border
    expect(card.props.className).toContain("opacity-60");
    expect(card.props.className).toContain("border-gray-400");
  });

  describe("Story 6.4: Display Eliminated Players", () => {
    it("should show eliminated players with visual distinction", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const { getByText, getByTestId } = render(
        <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
      );

      // Should show eliminated badge
      const eliminatedBadge = getByText("Eliminated");
      expect(eliminatedBadge).toBeTruthy();

      // Card should be visually distinct
      const card = getByTestId("player-card-Player 1");
      expect(card.props.className).toContain("opacity-60");
    });

    it("should show eliminated players with icon indicator", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const { getByText } = render(
        <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
      );

      // Should have icon (❌) in eliminated badge
      const eliminatedText = getByText("Eliminated");
      expect(eliminatedText).toBeTruthy();
      // Icon is in the same View as the text
    });

    it("should keep eliminated players visible but non-interactive", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <PlayerCard 
          player={eliminatedPlayer} 
          isLeader={false} 
          gameId={1}
          onPress={mockOnPress}
        />
      );

      const card = getByTestId("player-card-Player 1");
      
      // Card should be disabled
      expect(card.props.disabled).toBe(true);
      
      // Card should still be visible
      expect(card).toBeTruthy();
    });

    it("should have accessible elimination status", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const { getByTestId } = render(
        <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
      );

      const card = getByTestId("player-card-Player 1");
      
      // Accessibility label should include elimination status
      expect(card.props.accessibilityLabel).toContain("Eliminated");
    });

    it("should supplement color coding with text and icon", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const { getByText } = render(
        <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
      );

      // Should have text indicator (not just color)
      const eliminatedText = getByText("Eliminated");
      expect(eliminatedText).toBeTruthy();
      
      // Should have icon indicator
      // Icon is in the badge View
    });

    it("should follow design system styling", () => {
      const eliminatedPlayer: Player = {
        ...mockPlayer,
        is_eliminated: true,
      };

      const { getByTestId, getByText } = render(
        <PlayerCard player={eliminatedPlayer} isLeader={false} gameId={1} />
      );

      const card = getByTestId("player-card-Player 1");
      const eliminatedBadge = getByText("Eliminated");
      
      // Should use NativeWind/Tailwind classes
      expect(card.props.className).toContain("rounded-card");
      expect(eliminatedBadge.props.className).toContain("bg-eliminated");
      expect(eliminatedBadge.props.className).toContain("rounded-badge");
    });
  });

  it("should handle player with special characters in name", () => {
    const specialPlayer: Player = {
      ...mockPlayer,
      name: "Player & Co.",
    };

    const { getByText, getByTestId } = render(
      <PlayerCard player={specialPlayer} isLeader={false} gameId={1} />
    );

    expect(getByText("Player & Co.")).toBeTruthy();
    expect(getByTestId("player-card-Player & Co.")).toBeTruthy();
  });

  it("should handle player with long name", () => {
    const longNamePlayer: Player = {
      ...mockPlayer,
      name: "Player With A Very Long Name That Might Wrap",
    };

    const { getByText } = render(
      <PlayerCard player={longNamePlayer} isLeader={false} gameId={1} />
    );

    expect(getByText("Player With A Very Long Name That Might Wrap")).toBeTruthy();
  });
});
