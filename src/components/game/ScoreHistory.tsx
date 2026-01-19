/**
 * Score History Component
 * Displays score entry history for a game
 */

import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
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
    <View className="flex-row justify-between items-center py-3 px-4 border-b border-[#E0E0E0]">
      <View className="flex-1">
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
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[20px] max-h-[80%] flex-1">
          <View className="flex-row justify-between items-center p-5 border-b border-[#E0E0E0]">
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
            <View className="flex-1 py-10 items-center justify-center">
              <Text className="text-base">Loading...</Text>
            </View>
          ) : scoreEntries.length === 0 ? (
            <View className="flex-1 py-10 items-center justify-center">
              <Text className="opacity-70">No score entries yet</Text>
            </View>
          ) : (
            <FlatList
              data={scoreEntries}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
