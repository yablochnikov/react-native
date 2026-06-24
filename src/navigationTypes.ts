export type RootStackParams = {
  Welcome: undefined;
  SignUp: undefined;
  Login: { username?: string } | undefined;
  Pin: undefined;
  Main: undefined;
  Post: { postId: number };
};

export type MainScreenParams = {
  Home: undefined;
  Portfolio: undefined;
  Search?: undefined;
  Profile?: undefined;
}

export type ProfileStackParams = {
  Settings: undefined;
  Language: undefined;
};