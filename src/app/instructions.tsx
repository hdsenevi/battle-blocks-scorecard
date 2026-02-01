/**
 * Wooden Battle Blocks – Game Instructions
 * Exact content from the official instructions.
 */

import { ScrollView, Text, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { PinCircle } from "@/components/PinCircle";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function InstructionsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
      title: "Instructions",
    });
  }, [navigation]);

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        accessibilityLabel="Game instructions content"
      >
        <Text
          className="text-2xl font-sans-bold mb-1 text-stone-900 dark:text-stone-50"
          accessibilityRole="header"
        >
          Wooden Battle Blocks
        </Text>

        <Text
          className="text-base font-sans mb-6 text-stone-700 dark:text-stone-300"
          accessibilityRole="text"
        >
          This throwing game is suitable for 6+ years old children and adults.
          It requires no special equipment and success is based on a combination
          of chance and skill. Minimum 2 players are required.
        </Text>

        <Text
          className="text-lg font-sans-bold mb-2 text-stone-900 dark:text-stone-50"
          accessibilityRole="header"
        >
          Parts List
        </Text>
        <View className="mb-6 ml-1">
          <Text className="text-base font-sans mb-1 text-stone-700 dark:text-stone-300">
            • 12 x block pins which are marked with numbers from 1 to 12
          </Text>
          <Text className="text-base font-sans mb-1 text-stone-700 dark:text-stone-300">
            • 1 x battle pin
          </Text>
          <Text className="text-base font-sans mb-1 text-stone-700 dark:text-stone-300">
            • 1 x wooden carry crate
          </Text>
        </View>

        <View className="flex-wrap mb-6 gap-4">
          <View className="flex-1 min-w-[200px] pr-4">
            <Text
              className="text-lg font-sans-bold mb-2 text-stone-900 dark:text-stone-50"
              accessibilityRole="header"
            >
              Before the Game
            </Text>
            <Text
              className="text-base font-sans text-stone-700 dark:text-stone-300"
              accessibilityRole="text"
            >
              The pins are initially placed in a tight group in an upright
              position 3-4 metres away from the throwing place. The pins are
              placed in a formation shown on the right. For the first game, the
              throwing order is drawn. In following games, the throwing order is
              determined according to the previous game results from lowest to
              highest score.
            </Text>
          </View>
          <View
            className="rounded-xl p-4 items-center justify-center border border-stone-300 dark:border-stone-600"
            style={{ minWidth: 140 }}
          >
            <View className="flex-row justify-center mb-1">
              <PinCircle value={7} />
              <PinCircle value={9} />
              <PinCircle value={8} />
            </View>
            <View className="flex-row justify-center mb-1">
              <PinCircle value={5} />
              <PinCircle value={11} />
              <PinCircle value={12} />
              <PinCircle value={6} />
            </View>
            <View className="flex-row justify-center mb-1">
              <PinCircle value={3} />
              <PinCircle value={10} />
              <PinCircle value={4} />
            </View>
            <View className="flex-row justify-center">
              <PinCircle value={1} />
              <PinCircle value={2} />
            </View>
          </View>
        </View>

        <Text
          className="text-lg font-sans-bold mb-2 text-stone-900 dark:text-stone-50"
          accessibilityRole="header"
        >
          Start the Game
        </Text>
        <Text
          className="text-base font-sans mb-6 text-stone-700 dark:text-stone-300"
          accessibilityRole="text"
        >
          First player throws the battle pin to the pins group and tries to
          knock over blocks.
        </Text>

        <Text
          className="text-lg font-sans-bold mb-2 text-stone-900 dark:text-stone-50"
          accessibilityRole="header"
        >
          Score
        </Text>
        <Text
          className="text-base font-sans mb-6 text-stone-700 dark:text-stone-300"
          accessibilityRole="text"
        >
          Knocking over one block scores the number of points marked on the
          block. Knocking 2 or more block scores the number of block knocked
          over. A block does not count if it is leaning on the battle pin or is
          one of the numbered blocks (it must be parallel to the ground to
          count). After each throw, the blocks are stood up again in the exact
          location where they landed.
        </Text>

        <Text
          className="text-lg font-sans-bold mb-2 text-stone-900 dark:text-stone-50"
          accessibilityRole="header"
        >
          End the Game
        </Text>
        <Text
          className="text-base font-sans mb-6 text-stone-700 dark:text-stone-300"
          accessibilityRole="text"
        >
          The first player to reach exactly 50 points wins the game. Scoring
          more than 50 points will be penalised by setting the player&apos;s
          score back to 25 points. A player will be eliminated from the game if
          they miss all of the target pins three times in a row.
        </Text>
      </ScrollView>
    </ThemedView>
  );
}
