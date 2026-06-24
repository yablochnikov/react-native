import Keychain from 'react-native-keychain';
import axios from 'axios';
import { User } from './store/store.ts';
import {
  createAuthRefresh,
} from 'axios-auth-refresh';

export interface Post {
  userId: number,
  id: number,
  title: string,
  body: string,
}

export interface Comment {
  postId: number,
  id: number,
  name: string,
  email: string,
  body: string,
}

export const TOKEN_SERVICE = 'tech-task.auth-tokens';
export const BIOMETRY_SERVICE = 'tech-task.biometry';
export const PIN_SERVICE = 'tech-task.pin';

export type Tokens = { accessToken: string; refreshToken: string };

export type LoginResponse = User | Tokens;

const authClient = axios.create({ baseURL: 'https://dummyjson.com/' });

const postsClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
});

export async function getTokens(): Promise<Tokens | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });

    if(!credentials) {
      return null;
    }

    console.log(credentials)
    return JSON.parse(credentials.password)
  } catch {
    return null
  }
};

authClient.interceptors.request.use(async config => {
    const tokens = await getTokens()
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  }
);

createAuthRefresh(authClient, async failedRequest => {
  const tokens = await getTokens();

  if (!tokens) {
    throw new Error('No refresh token');
  }

  const { data } = await authClient.post<any>('auth/refresh', {
    refreshToken: tokens.refreshToken,
    expiresInMins: 30,
  });

  await saveTokens(data);
  failedRequest.response.config.headers.Authorization = `Bearer ${data.accessToken}`;
});

export async function saveTokens(tokens: Tokens) {
  try {
    await Keychain.setGenericPassword('session', JSON.stringify(tokens), {
      service: TOKEN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch (error) {
    console.log('Keychain could not be accessed', error);
  } finally {
    const credentials = await Keychain.getGenericPassword();

    console.log(credentials)
  }
}

export async function login(username: string, password: string) {
  const { data } = await authClient.post<any>(
    'auth/login',
    { username, password, expiresInMins: 30 },
    { headers: { 'Content-Type': 'application/json' } },
  );

  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data;
}

export async function getPosts({limit = 10}):Promise<Post[]> {
  const {data} = await postsClient.get('/posts', {params: {_limit: limit}});

  return data;
}

export async function getPost(id: number):Promise<Post> {
  const {data} = await postsClient.get(`/posts/${id}`);

  return data;
}

export async function getComments (id: number): Promise<Comment[]> {
  const {data} = await postsClient.get(`/posts/${id}/comments`);

  return data;
}

export async function getCurrentUser():Promise<User> {
  const { data } = await postsClient.get(`/auth/me`);

  return data
}

export async function clearSecureSession() {
  await Promise.all([
    Keychain.resetGenericPassword({service: TOKEN_SERVICE}),
    Keychain.resetGenericPassword({ service: PIN_SERVICE }),
    Keychain.resetGenericPassword({ service: BIOMETRY_SERVICE }),
  ])
}