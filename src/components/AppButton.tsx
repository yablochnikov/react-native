import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme.ts';


interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'text';
}

export function AppButton({ title, onPress, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'outline' && styles.buttonOutline,
        variant === 'text' && styles.buttonText,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant === 'text' && styles.buttonText,
          variant === 'outline' && styles.textOutline,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    paddingHorizontal: 12,
    color: colors.white,
    fontWeight: 'semibold',
    fontSize: 15,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    backgroundColor: 'transparent',
  },
  textOutline: {
    color: colors.textSecondary,
  },
  buttonText: {
    backgroundColor: 'transparent',
    color: colors.accent,
  },
  buttonLabel: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.3,
  }

});
