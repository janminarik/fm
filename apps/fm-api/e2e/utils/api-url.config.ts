const BASE_API_URL = "/api/v1";

export const AuthControllerUrl = {
  Base: `${BASE_API_URL}/auth`,
  Login: `${BASE_API_URL}/auth/login`,
  RefreshAccessToken: `${BASE_API_URL}/auth/refresh-access-token`,
  RefreshTokens: `${BASE_API_URL}/auth/refresh-tokens`,
};

export const UserControllerUrl = {
  Base: `${BASE_API_URL}/user`,
  Create: `${BASE_API_URL}/user/create`,
  Profile: `${BASE_API_URL}/user/profile`,
} as const;

export const AdSpaceControllerUrl = {
  Base: `${BASE_API_URL}/adspace`,
  Create: `${BASE_API_URL}/adspace/create`,
  Get: `${BASE_API_URL}/adspace`,
  List: `${BASE_API_URL}/adspace/list`,
  Update: `${BASE_API_URL}/adspace`,
  Delete: `${BASE_API_URL}/adspace`,
} as const;
