import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppDispatch,
  preferencesActions,
  RootState,
} from '../../store/store.ts';
import { ProfileStackParams } from '../../navigationTypes.ts';
import { Screen } from '../../components/Screen.tsx';
import { BackButton } from '../../components/BackButton.tsx';
import { colors, radius } from '../../theme.ts';
import LanguageIcon from '../../assets/icons/LanguageIcon.tsx';

type Props = NativeStackScreenProps<ProfileStackParams, 'Language'>;
type Language = 'en' | 'ar';

type LanguageOption = {
  labelKey: 'settings.english' | 'settings.arabic';
  value: Language;
};

const languages: LanguageOption[] = [
  {
    labelKey: 'settings.english',
    value: 'en',
  },
  {
    labelKey: 'settings.arabic',
    value: 'ar',
  },
];

export function LanguageScreen({ navigation }: Props) {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currentLanguage = useSelector(
    (state: RootState) => state.preferences.language,
  );

  const changeLanguage = async (next: Language) => {
    dispatch(preferencesActions.setLanguage(next));
    await i18n.changeLanguage(next);
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={styles.title}>{t('settings.language')}</Text>

        <View style={styles.list}>
          {languages.map(language => (
            <LanguageRow
              key={language.value}
              title={t(language.labelKey)}
              selected={currentLanguage === language.value}
              onPress={() => changeLanguage(language.value)}
              icon={<LanguageIcon />}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function LanguageRow({
  icon,
  title,
  selected,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.languageRow, pressed && styles.pressed]}
    >
      <View style={styles.languageLeft}>
        {icon}
        <Text style={styles.languageTitle}>{title}</Text>
      </View>

      <View style={[styles.checkCircle, selected && styles.checkCircleActive]}>
        {selected ? <Text style={styles.checkText}>✓</Text> : null}
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
    marginTop: 26,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  list: {
    marginTop: 22,
    gap: 18,
  },

  languageRow: {
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

  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  languageIcon: {
    fontSize: 26,
    color: colors.accent,
  },

  languageTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF1F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkCircleActive: {
    backgroundColor: colors.accent,
  },

  checkText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
