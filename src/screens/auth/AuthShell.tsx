import { ReactNode, useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '../../components/BackButton.tsx';
import { Screen } from '../../components/Screen.tsx';
import { colors, radius } from '../../theme.ts';
import SignInIcon from '../../assets/icons/SignInIcon.tsx';

interface AuthShellProps {
  title: string;
  subtitle: string;
  onGoBack: () => void;
  children: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  onGoBack,
  children,
  icon,
  footer,
}: AuthShellProps) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const footerBottom =
    keyboardHeight > 0 ? keyboardHeight + 8 : Math.max(insets.bottom, 16);

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.authTop}>
          <BackButton onPress={onGoBack} />
        </View>

        <View style={styles.authCard}>
          <View style={styles.authIcon}>
            {icon ?? <SignInIcon />}
          </View>

          <View>
            <Text style={styles.authTitle}>{title}</Text>
            <Text style={styles.authSubtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {footer ? (
          <View style={[styles.footer, { bottom: footerBottom }]}>
            {footer}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: colors.background,
  },

  authTop: {
    height: 68,
    flexDirection: 'row',
    marginLeft: 16,
    alignItems: 'center',
  },

  authCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderTopLeftRadius: radius.big,
    borderTopRightRadius: radius.big,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  authIcon: {
    width: 48,
    height: 48,
    padding: 12,
    backgroundColor: colors.tealLight,
    borderRadius: 100,
  },

  authTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },

  authSubtitle: {
    color: colors.textSecondary,
  },

  form: {
    flex: 1,
    backgroundColor: colors.white,
  },

  formContent: {
    padding: 16,
    paddingBottom: 120,
  },

  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    elevation: 20,
  },
});
