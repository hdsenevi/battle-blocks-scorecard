/**
 * Score History Component
 * Displays score entry history for a game
 */

import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getScoreEntriesByGame, getPlayersByGame } from "@/services/database";
import type { ScoreEntry } from "@/database/types";

interface ScoreHistoryProps {
  visible: boolean;
  gameId: number;
  onClose: () => void;
}

interface ScoreHistoryItem extends ScoreEntry {
  playerName: string;
}

export function ScoreHistory({ visible, gameId, onClose }: ScoreHistoryProps) {
  const [scoreEntries, setScoreEntries] = useState<ScoreHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && gameId) {
      loadScoreHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, gameId]);

  const loadScoreHistory = async () => {
    setIsLoading(true);
    try {
      const [entries, players] = await Promise.all([
        getScoreEntriesByGame(gameId),
        getPlayersByGame(gameId),
      ]);

      // Create a map of player IDs to names
      const playerMap = new Map<number, string>();
      players.forEach((player) => {
        playerMap.set(player.id, player.name);
      });

      // Combine entries with player names and sort by created_at (most recent first)
      const historyItems: ScoreHistoryItem[] = entries
        .map((entry) => ({
          ...entry,
          playerName: playerMap.get(entry.player_id) || "Unknown",
        }))
        .sort((a, b) => b.created_at - a.created_at);

      setScoreEntries(historyItems);
    } catch (error) {
      console.error("Failed to load score history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatEntryType = (type: string): string => {
    return type === "single_block" ? "Single Block" : "Multiple Blocks";
  };

  const renderItem = ({ item }: { item: ScoreHistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemLeft}>
        <ThemedText style={styles.playerName}>{item.playerName}</ThemedText>
        <ThemedText style={styles.entryType}>
          {formatEntryType(item.entry_type)}
        </ThemedText>
        <ThemedText style={styles.timestamp}>
          {formatTimestamp(item.created_at)}
        </ThemedText>
      </View>
      <ThemedText style={styles.scoreValue}>+{item.score_value}</ThemedText>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Score History
            </ThemedText>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Close score history"
              accessibilityRole="button"
            >
              <ThemedText style={styles.closeButton}>Close</ThemedText>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ThemedText>Loading...</ThemedText>
            </View>
          ) : scoreEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No score entries yet</ThemedText>
            </View>
          ) : (
            <FlatList
              data={scoreEntries}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  closeButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  historyItemLeft: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  entryType: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
  },
});
