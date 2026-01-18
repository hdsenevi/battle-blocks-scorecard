import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text className="text-3xl font-bold">This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text className="text-base text-[#0a7ea4]">Go to home screen</Text>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
