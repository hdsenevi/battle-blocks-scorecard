/**
 * Player Card Component
 * Displays a player's name, score, and status
 */

import { View, TouchableOpacity, Platform, Text } from "react-native";
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
  const minHeight = Platform.select({ ios: 80, android: 88, default: 80 });

  return (
    <TouchableOpacity
      className={`bg-gray-50 rounded-card p-4 border-2 border-gray-200 ${player.is_eliminated ? "opacity-50" : ""}`}
      style={{ minHeight }}
      onPress={onPress}
      disabled={player.is_eliminated || !onPress}
      testID={`player-card-${player.name}`}
      accessibilityLabel={`${player.name}, Score: ${player.current_score}${isLeader ? ", Leader" : ""}${player.is_eliminated ? ", Eliminated" : ""}`}
      accessibilityRole="button"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 gap-2">
          <Text className="text-lg font-semibold text-black">
            {player.name}
          </Text>
          {isLeader && (
            <View className="self-start bg-primary rounded-badge px-2 py-1 mt-1">
              <Text className="text-white text-xs font-semibold">
                👑 Leader
              </Text>
            </View>
          )}
          {player.is_eliminated && (
            <View className="self-start bg-eliminated rounded-badge px-2 py-1 mt-1">
              <Text className="text-white text-xs font-semibold">
                Eliminated
              </Text>
            </View>
          )}
        </View>
        <Text className="text-3xl font-bold text-primary">
          {player.current_score}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
