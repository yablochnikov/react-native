import { combineReducers, configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from 'redux-persist'

type Session = 'booting' | 'guest' | 'pinSetup' | 'locked' | 'unlocked';

type Gender = 'male' | 'female';

type Language = 'en' | 'ar';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  image?: string;
}

type AuthState = {
  session: Session;
}

interface ApiTestState {
  loginResponse: any | null;
  posts: any[];
  selectedPost: any | null;
  comments: any[];
  currentUserResponse: User | null;
  error: string | null;
}

const apiTestSlice = createSlice({
  name: 'apiTest',
  initialState: {
    loginResponse: null,
    posts: [],
    selectedPost: null,
    comments: [],
    currentUserResponse: null,
    error: null,
  } as ApiTestState,
  reducers: {
    setLoginResponse: (state, action) => {
      state.loginResponse = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setCurrentUserResponse: (state, action) => {
      state.currentUserResponse = action.payload;
    },
    setApiError: (state, action) => {
      state.error = action.payload;
    },
    clearApiTest: state => {
      state.loginResponse = null;
      state.posts = [];
      state.selectedPost = null;
      state.error = null;
      state.comments = [];
      state.currentUserResponse = null;
    },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { session: 'booting' } as AuthState,
  reducers: {
    showGuest(state) {
      state.session = 'guest';
    },
    authenticated(state) {
      state.session = 'pinSetup';
    },
    restoreLocked(state) {
      state.session = 'locked';
    },
    unlock(state) {
      state.session = 'unlocked';
    },
    lock(state) {
      state.session = 'locked';
    },
    loggedOut(state) {
      state.session = 'guest';
    },
  },
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {user: null as User | null},
  reducers:{
    setUser(state, action: PayloadAction<User>){
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    }
  }
})

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {language: 'en' as Language},
  reducers: {
    setLanguage(state, action: PayloadAction<Language>){
      state.language = action.payload;
    }
  }
})
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  profile: profileSlice.reducer,
  preferences: preferencesSlice.reducer,
  apiTest: apiTestSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export const persistor = persistStore(store);
export const authActions = authSlice.actions;
export const profileActions = profileSlice.actions;
export const preferencesActions = preferencesSlice.actions;
export const apiTestActions = apiTestSlice.actions;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch