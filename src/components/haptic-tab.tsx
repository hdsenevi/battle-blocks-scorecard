/**
 * Haptic Tab Component
 * Wraps tab bar button with haptic feedback
 */

import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: PressableProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (props.onPressIn) {
          props.onPressIn(ev);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    />
  );
}
