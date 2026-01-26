/**
 * Privacy Policy Screen
 * Story 6.5: App Store and Play Store Compliance (FR52)
 * Displays privacy policy and data handling information
 */

import { ScrollView, Text, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function PrivacyScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
      title: "Privacy Policy",
    });
  }, [navigation]);

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        accessibilityLabel="Privacy policy content"
      >
        <View className="mb-6">
          <Text 
            className="text-2xl font-sans-bold mb-4 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
            accessibilityLabel="Privacy Policy title"
          >
            Privacy Policy
          </Text>
          <Text 
            className="text-sm font-sans opacity-70 mb-6 text-stone-600 dark:text-stone-400"
            accessibilityRole="text"
          >
            Last Updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Data Collection
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            Battle Blocks Scorecard does not collect, transmit, or share any personal data. 
            All game data (scores, player names, game history) is stored locally on your device 
            using SQLite database. No data is sent to external servers or third parties.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Local Data Storage
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            The app stores the following data locally on your device:
          </Text>
          <View className="ml-4 mb-4">
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • Game records (game ID, status, timestamps)
            </Text>
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • Player information (names, scores, game statistics)
            </Text>
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • Score entry history (for game tracking)
            </Text>
          </View>
          <Text 
            className="text-base font-sans opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            This data is stored securely on your device and is not accessible by other apps 
            or external services. You can delete this data by uninstalling the app.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            No Network Access
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            The app operates completely offline. It does not require internet connectivity 
            and does not make any network requests. No data is transmitted outside your device.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            No Third-Party Services
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            The app does not integrate with any third-party analytics services, advertising 
            networks, or data collection services. No user tracking or analytics are performed.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Children&apos;s Privacy
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            The app is designed to be safe for users of all ages, including children. 
            Since no data is collected or transmitted, there are no privacy concerns 
            regarding children&apos;s data.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Your Rights
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            Since all data is stored locally on your device, you have complete control 
            over your data. You can:
          </Text>
          <View className="ml-4 mb-4">
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • View your game data within the app
            </Text>
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • Delete individual games or all data by uninstalling the app
            </Text>
            <Text className="text-base font-sans opacity-90 mb-2 text-stone-700 dark:text-stone-300" accessibilityRole="text">
              • Export or backup data (if supported in future versions)
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Changes to This Policy
          </Text>
          <Text 
            className="text-base font-sans mb-4 opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            We may update this privacy policy from time to time. The &quot;Last Updated&quot; date 
            at the top of this page indicates when the policy was last revised. 
            Continued use of the app after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-lg font-sans-semibold mb-3 text-stone-900 dark:text-stone-50"
            accessibilityRole="header"
          >
            Contact
          </Text>
          <Text 
            className="text-base font-sans opacity-90 text-stone-700 dark:text-stone-300"
            accessibilityRole="text"
          >
            If you have any questions about this privacy policy, please contact us through 
            the app store listing or support channels.
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
