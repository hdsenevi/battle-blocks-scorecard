import { Link } from 'expo-router';
import { Text } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center p-5">
      <Text className="text-3xl font-bold">This is a modal</Text>
      <Link href="/" dismissTo className="mt-4 py-4">
        <Text className="text-base text-link">Go to home screen</Text>
      </Link>
    </ThemedView>
  );
}
