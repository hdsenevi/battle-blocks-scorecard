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
  Text,
} from "react-native";
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
        <Text className="text-base font-semibold mb-1">{item.playerName}</Text>
        <Text className="text-sm opacity-70 mb-0.5">
          {formatEntryType(item.entry_type)}
        </Text>
        <Text className="text-xs opacity-50">
          {formatTimestamp(item.created_at)}
        </Text>
      </View>
      <Text className="text-xl font-bold text-primary">+{item.score_value}</Text>
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
            <Text className="text-2xl">
              Score History
            </Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Close score history"
              accessibilityRole="button"
            >
              <Text className="text-base text-primary font-semibold">Close</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text className="text-base">Loading...</Text>
            </View>
          ) : scoreEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text className="opacity-70">No score entries yet</Text>
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
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
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
});
