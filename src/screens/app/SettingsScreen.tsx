import { ReactNode } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppDispatch,
  authActions,
  profileActions,
  RootState,
} from '../../store/store.ts';
import { ProfileStackParams } from '../../navigationTypes.ts';
import { Screen } from '../../components/Screen.tsx';
import { clearSecureSession } from '../../api.ts';
import { colors, radius } from '../../theme.ts';

import ArrowIcon from '../../assets/icons/ArrowIcon.tsx';
import LanguageIcon from '../../assets/icons/LanguageIcon.tsx';
import LogOutIcon from '../../assets/icons/LogOutIcon.tsx';

type Props = NativeStackScreenProps<ProfileStackParams, 'Settings'>;

interface SettingsRowProps {
  icon?: ReactNode;
  title: string;
  value?: string;
  onPress: () => void;
}

export function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const user = useSelector((state: RootState) => state.profile.user);
  const name = user ? `${user.firstName} ${user.lastName}` : 'John Doe';

  const logout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            await clearSecureSession();
            queryClient.clear();
            dispatch(profileActions.clearUser());
            dispatch(authActions.loggedOut());
          },
        },
      ],
    );
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('settings.title')}</Text>

        <View style={styles.profileCard}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar} />
          )}

          <View>
            <Text style={styles.name}>{name}</Text>
            {user?.email ? (
              <Text style={styles.email}>{user.email}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.basic')}</Text>

        <SettingsRow
          icon={<LanguageIcon />}
          title={t('settings.language')}
          onPress={() => navigation.navigate('Language')}
        />

        <Text style={styles.sectionTitle}>{t('settings.other')}</Text>

        <SettingsRow
          icon={<LogOutIcon />}
          title={t('settings.logout')}
          onPress={logout}
        />
      </ScrollView>
    </Screen>
  );
}

function SettingsRow({ icon, title, value, onPress }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingsRow, pressed && styles.pressed]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>

      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <View style={styles.rowArrow}>
          <ArrowIcon />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 22,
  },

  profileCard: {
    height: 96,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.medium,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.white,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF1F5',
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  email: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },

  sectionTitle: {
    marginTop: 34,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },

  settingsRow: {
    height: 68,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.medium,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pressed: {
    opacity: 0.65,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  iconBox: {
    width: 24,
    alignItems: 'center',
  },

  rowIcon: {
    fontSize: 26,
    color: colors.accent,
  },

  logoutIcon: {
    fontSize: 24,
    color: colors.accent,
  },

  rowTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rowValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  rowArrow: {
    transform: [{ rotate: '180deg' }],
  },
});
