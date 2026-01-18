/**
 * Player Card Component
 * Displays a player's name, score, and status
 */

import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import type { Player } from "@/database/types";

interface PlayerCardProps {
  player: Player;
  isLeader: boolean;
  gameId: number;
  onPress?: () => void;
}

export function PlayerCard({
  player,
  isLeader,
  gameId,
  onPress,
}: PlayerCardProps) {
  const cardStyle = [
    styles.card,
    isLeader && styles.leaderCard,
    player.is_eliminated && styles.eliminatedCard,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={player.is_eliminated || !onPress}
      testID={`player-card-${player.name}`}
      accessibilityLabel={`${player.name}, Score: ${player.current_score}${isLeader ? ", Leader" : ""}${player.is_eliminated ? ", Eliminated" : ""}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <ThemedText style={styles.name}>{player.name}</ThemedText>
          {isLeader && (
            <View style={styles.leaderBadge}>
              <ThemedText style={styles.leaderText}>👑 Leader</ThemedText>
            </View>
          )}
          {player.is_eliminated && (
            <View style={styles.eliminatedBadge}>
              <ThemedText style={styles.eliminatedText}>Eliminated</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={styles.score}>{player.current_score}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    minHeight: Platform.select({ ios: 80, android: 88, default: 80 }),
  },
  leaderCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  eliminatedCard: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  leaderBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  leaderText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  eliminatedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#999999",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  eliminatedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  score: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007AFF",
  },
});
