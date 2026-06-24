import type { ComponentType } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen.tsx';
import { colors, radius } from '../../theme.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WelcomeStack1 from '../../assets/images/WelcomeStack1.tsx';
import WelcomeStack2 from '../../assets/images/WelcomeStack2.tsx';
import WelcomeStack3 from '../../assets/images/WelcomeStack3.tsx';
import WelcomeStack4 from '../../assets/images/WelcomeStack4.tsx';
import WelcomeStack5 from '../../assets/images/WelcomeStack5.tsx';
import {AppButton} from "../../components/AppButton.tsx";
import {useNavigation} from "@react-navigation/core";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigationTypes.ts';
import { useTranslation } from 'react-i18next';

const CARD_WIDTH = 164;
const CARD_HEIGHT = 136;
const GAP = 16;
const SCREEN_PADDING = 8;
const RIGHT_COLUMN_OFFSET = 72;
const ACTION_BOTTOM_OFFSET = 24;

type CardItem =
  | {
  id: string;
  type: 'logo';
}
  | {
  id: string;
  type: 'stack';
  titleKey: string;
  Icon: ComponentType<any>;
};

type ColumnItem = {
  id: string;
  topOffset: number;
  items: CardItem[];
};

const COLUMNS: ColumnItem[] = [
  {
    id: 'left-column',
    topOffset: 0,
    items: [
      {
        id: 'logo',
        type: 'logo',
      },
      {
        id: 'stack-1',
        type: 'stack',
        titleKey: 'welcome.stack1',
        Icon: WelcomeStack1,
      },
      {
        id: 'stack-3',
        type: 'stack',
        titleKey: 'welcome.stack3',
        Icon: WelcomeStack3,
      },
    ],
  },
  {
    id: 'right-column',
    topOffset: RIGHT_COLUMN_OFFSET,
    items: [
      {
        id: 'stack-2',
        type: 'stack',
        titleKey: 'welcome.stack2',
        Icon: WelcomeStack2,
      },
      {
        id: 'stack-4',
        type: 'stack',
        titleKey: 'welcome.stack4',
        Icon: WelcomeStack4,
      },
      {
        id: 'stack-5',
        type: 'stack',
        titleKey: 'welcome.stack5',
        Icon: WelcomeStack5,
      },
    ],
  },
];

function ColumnSeparator() {
  return <View style={styles.columnGap} />;
}

export function WelcomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const insets = useSafeAreaInsets();

  return (
    <Screen style={styles.welcomeScreen}>
      <Image
        source={require('../../assets/images/welcome-bg.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      <FlatList
        data={COLUMNS}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        ItemSeparatorComponent={ColumnSeparator}
        renderItem={({ item }) => (
          <View style={[styles.column, { marginTop: item.topOffset }]}>
            {item.items.map(card => {
              if (card.type === 'logo') {
                return (
                  <Image
                    key={card.id}
                    source={require('../../assets/images/bootsplash-logo.png')}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                );
              }

              const Icon = card.Icon;

              return (
                <View key={card.id} style={styles.stack}>
                  <Icon width={118} height={64} />

                  <Text style={styles.stackText}>{t(card.titleKey)}</Text>
                </View>
              );
            })}
          </View>
        )}
      />

      <View
        style={[
          styles.welcomeActions,
          { paddingBottom: Math.max(insets.bottom, ACTION_BOTTOM_OFFSET) },
        ]}
      >
        <AppButton
          title={t('auth.signIn')}
          variant="text"
          onPress={() => navigation.navigate('Login')}
        />
        <AppButton
          title={t('auth.signUp')}
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcomeScreen: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: colors.background,
  },

  backgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    width: '100%',
  },

  welcomeActions: {
    gap: 8,
    paddingTop: 12,
  },

  grid: {
    paddingTop: 10,
    paddingHorizontal: SCREEN_PADDING,
  },

  column: {
    width: '50%',
    gap: GAP,
  },

  columnGap: {
    width: GAP,
  },

  logo: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.small,
  },

  stack: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: colors.white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 20,

    elevation: 2,
  },

  stackText: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
    color: '#5F6673',
    textAlign: 'center',
  },
});
