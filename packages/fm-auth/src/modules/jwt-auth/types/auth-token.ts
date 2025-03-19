export type AuthToken = {
  token: string;
  expiresAt: number;
};

export type AuthTokenPair = {
  accessToken: AuthToken;
  refreshToken: AuthToken;
};
