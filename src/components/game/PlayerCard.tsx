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
      className={`bg-white dark:bg-stone-800 rounded-card p-4 border-2 shadow-card ${
        player.is_eliminated 
          ? "border-stone-500 dark:border-stone-500 opacity-60" 
          : "border-gray-border dark:border-stone-600"
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
            className={`text-lg font-sans-semibold ${
              player.is_eliminated 
                ? "text-stone-500 dark:text-stone-400" 
                : "text-stone-900 dark:text-stone-50"
            }`}
          >
            {player.name}
          </Text>
          {isLeader && (
            <View className="self-start bg-leader dark:bg-amber-400 rounded-badge px-2 py-1 mt-1">
              <Text className="text-white dark:text-stone-900 text-xs font-sans-semibold">
                👑 Leader
              </Text>
            </View>
          )}
          {player.is_eliminated && (
            <View className="self-start bg-eliminated dark:bg-stone-500 rounded-badge px-2 py-1 mt-1 flex-row items-center gap-1">
              <Text className="text-white text-xs">❌</Text>
              <Text className="text-white text-xs font-sans-semibold">
                Eliminated
              </Text>
            </View>
          )}
          {hasScoredThisRound && !player.is_eliminated && (
            <View className="self-start bg-stone-500 dark:bg-stone-600 rounded-badge px-2 py-1 mt-1">
              <Text className="text-white text-xs font-sans-semibold">
                Scored This Round
              </Text>
            </View>
          )}
        </View>
        <Text 
          className={`text-3xl font-sans-bold ${
            player.is_eliminated 
              ? "text-stone-400 dark:text-stone-500" 
              : "text-primary dark:text-primary-bright"
          }`}
        >
          {player.current_score}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
