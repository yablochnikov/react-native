import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import ArrowIcon from '../assets/icons/ArrowIcon.tsx';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.back, style]}>
      <Text style={styles.backLabel}>
        <ArrowIcon />
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 24,
    height: 24,
    justifyContent: 'center',
  },
  backLabel: {},
});
