import {
  AppState,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { authActions, persistor, RootState, store } from './src/store/store.ts';
import './src/i18n';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AppNavigator } from './src/navigation.tsx';
import { NavigationContainer } from '@react-navigation/native';
import {
  PersistQueryClientProvider
} from '@tanstack/react-query-persist-client';
import { QueryClient } from '@tanstack/query-core';
import {
  createAsyncStoragePersister
} from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from "react";
import * as Keychain from "react-native-keychain";
import {getTokens, PIN_SERVICE} from "./src/api.ts";
import {enableScreens} from "react-native-screens";
import { useTranslation } from 'react-i18next';

enableScreens();

const DAY = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      networkMode: 'offlineFirst',
    },
    mutations: {networkMode: 'offlineFirst'},
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TECH_TASK_QUERY_CACHE'
})

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: asyncStoragePersister,
            maxAge: DAY,
          }}
        >
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <AppContent />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

function AppContent () {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const session = useSelector((state: RootState) => state.auth.session)
  const user = useSelector((state: RootState) => state.profile.user)
  const language = useSelector((state: RootState) => state.preferences.language)

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      try {
        const [tokens, hasPin] = await Promise.all([
          getTokens(),
          Keychain.hasGenericPassword({ service: PIN_SERVICE }),
        ]);
        if (!active) {
          return;
        }
        if (!tokens) {
          dispatch(authActions.showGuest());
          return;
        }
        dispatch(
          hasPin ? authActions.restoreLocked() : authActions.authenticated(),
        );
      } catch {
        dispatch(user ? authActions.restoreLocked() : authActions.showGuest());
      }
    };
    restore();

    return () => {
      active = false;
    };
  }, [dispatch, user])

  useEffect(() => {
    const listener = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active' && session === 'unlocked') {
        dispatch(authActions.lock());
      }
    });

    return () => listener.remove();
  }, [dispatch, session])

  if (session === 'booting') {
    return <View />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
