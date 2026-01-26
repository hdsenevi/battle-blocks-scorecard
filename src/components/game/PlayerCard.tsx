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
  hasScoredThisRound?: boolean;
}

export function PlayerCard({
  player,
  isLeader,
  gameId,
  onPress,
  hasScoredThisRound = false,
}: PlayerCardProps) {
  const minHeight = Platform.select({ ios: 80, android: 88, default: 80 });
  const isDisabled = player.is_eliminated || hasScoredThisRound || !onPress;

  return (
    <TouchableOpacity
      className={`bg-gray-50 dark:bg-gray-800 rounded-card p-4 border-2 ${
        player.is_eliminated 
          ? "border-gray-400 dark:border-gray-600 opacity-60" 
          : "border-gray-200 dark:border-gray-700"
      } ${isDisabled && !player.is_eliminated ? "opacity-50" : ""}`}
      style={{ minHeight }}
      onPress={onPress}
      disabled={isDisabled}
      testID={`player-card-${player.name}`}
      accessibilityLabel={`${player.name}, Score: ${player.current_score}${isLeader ? ", Leader" : ""}${player.is_eliminated ? ", Eliminated" : ""}${hasScoredThisRound ? ", Already scored this round" : ""}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 gap-2">
          <Text 
            className={`text-lg font-semibold ${
              player.is_eliminated 
                ? "text-gray-500 dark:text-gray-400" 
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {player.name}
          </Text>
          {isLeader && (
            <View className="self-start bg-primary dark:bg-blue-500 rounded-badge px-2 py-1 mt-1">
              <Text className="text-white text-xs font-semibold">
                👑 Leader
              </Text>
            </View>
          )}
          {player.is_eliminated && (
            <View className="self-start bg-eliminated dark:bg-gray-500 rounded-badge px-2 py-1 mt-1 flex-row items-center gap-1">
              <Text className="text-white text-xs">❌</Text>
              <Text className="text-white text-xs font-semibold">
                Eliminated
              </Text>
            </View>
          )}
          {hasScoredThisRound && !player.is_eliminated && (
            <View className="self-start bg-gray-400 dark:bg-gray-600 rounded-badge px-2 py-1 mt-1">
              <Text className="text-white text-xs font-semibold">
                Scored This Round
              </Text>
            </View>
          )}
        </View>
        <Text 
          className={`text-3xl font-bold ${
            player.is_eliminated 
              ? "text-gray-400 dark:text-gray-500" 
              : "text-primary dark:text-blue-400"
          }`}
        >
          {player.current_score}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
