import { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { colors, radius } from '../theme.ts';
import { InfoIcon } from '../assets/icons/InfoIcon.tsx';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  trailing?: ReactNode;
}

export function TextField({
  label,
  error,
  trailing,
  style,
  ...props
}: TextFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      {label ? (<Text style={styles.label}>{label}</Text>) : null}

      <View style={[styles.inputFrame, error && styles.inputError]}>
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          underlineColorAndroid="transparent"
        />

        {error ? (
          <View style={styles.icon} pointerEvents="none">
            <InfoIcon />
          </View>
        ) : null}

        {trailing}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    gap: 8,
  },

  label: {
    marginLeft: 16,
    fontSize: 15,
    color: colors.textSecondary,
  },

  inputFrame: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: radius.small,
    borderColor: colors.borderLight,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: colors.textPrimary,
    fontSize: 15,
  },

  inputError: {
    borderColor: colors.danger,
  },

  error: {
    color: colors.error,
    fontSize: 13,
  },

  icon: {
    marginLeft: 8,
  },
});
