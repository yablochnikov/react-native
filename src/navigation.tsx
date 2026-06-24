import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import {
  MainScreenParams,
  ProfileStackParams,
  RootStackParams,
} from './navigationTypes.ts';
import { RootState } from './store/store.ts';

import { WelcomeScreen } from './screens/auth/WelcomeScreen.tsx';
import { LoginScreen } from './screens/auth/LoginScreen.tsx';
import { SignUpScreen } from './screens/auth/SignUpScreen.tsx';
import { PinScreen } from './screens/auth/PinScreen.tsx';
import { HomeScreen } from './screens/app/HomeScreen.tsx';
import { PostScreen } from './screens/app/PostScreen.tsx';
import { PortfolioScreen } from './screens/app/PortfolioScreen.tsx';
import { SearchScreen } from './screens/app/SearchScreen.tsx';
import { SettingsScreen } from './screens/app/SettingsScreen.tsx';
import { LanguageScreen } from './screens/app/LanguageScreen.tsx';

import HomeIcon from './assets/icons/HomeIcon.tsx';
import PortfolioIcon from './assets/icons/PortfolioIcon.tsx';
import SearchIcon from './assets/icons/SearchIcon.tsx';
import ProfileIcon from './assets/icons/ProfileIcon.tsx';
import { colors } from './theme.ts';
import { useTranslation } from 'react-i18next';

const RootStack = createNativeStackNavigator<RootStackParams>();
const Tabs = createBottomTabNavigator<MainScreenParams>();
const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

function renderHomeIcon({ color }: { color: string }) {
  return <HomeIcon color={color} />;
}

function renderPortfolioIcon({ color }: { color: string }) {
  return <PortfolioIcon color={color} />;
}

function renderSearchIcon({ color }: { color: string }) {
  return <SearchIcon color={color} />;
}

function renderProfileIcon({ color }: { color: string }) {
  return <ProfileIcon color={color} />;
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Language" component={LanguageScreen} />
    </ProfileStack.Navigator>
  );
}

export function AppNavigator() {
  const session = useSelector((state: RootState) => state.auth.session);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      {session === 'guest' ? (
        <>
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : null}

      {session === 'pinSetup' || session === 'locked' ? (
        <RootStack.Screen name="Pin" component={PinScreen} />
      ) : null}

      {session === 'unlocked' ? (
        <>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="Post" component={PostScreen} />
        </>
      ) : null}
    </RootStack.Navigator>
  );
}

export function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: renderHomeIcon,
        }}
      />

      <Tabs.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: t('tabs.portfolio'),
          tabBarIcon: renderPortfolioIcon,
        }}
      />

      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t('tabs.search'),
          tabBarIcon: renderSearchIcon,
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 83,
    paddingTop: 5,
    paddingBottom: 7,
    borderTopColor: colors.border,
  },

  tabLabel: {
    fontSize: 12,
  },
});
