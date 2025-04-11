import {
  test,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  afterEach,
} from "@jest/globals";
import { INestApplication } from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";

import { LoginRequestDto } from "../../src/api/auth/dto";
import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import { AuthControllerUrl } from "../utils/api-url.config";
import { getJwtToken } from "../utils/cookie-utils";
import { TestApiClient } from "../utils/test-api-client";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

describe("AuthControler (e2e)", () => {
  let app: INestApplication;
  let apiClient: TestApiClient;
  let testUser: TestUser;

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  beforeEach(async () => {
    app = await createTestApp();
    apiClient = new TestApiClient(app);
  });

  afterAll(async () => {
    await deleteTestUser(testUser.id);
    await app.close();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("/api/auth/login (POST)", () => {
    test("should log in and return a JWT token if user credentials are valid (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data, status } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.Login,
        loginPayload,
      );

      expect(status).toBeDefined();
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });

    test("should log in and set the authentication cookie (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const cookieService = app.get(AuthCookieService);

      const { response, status } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.Login,
        loginPayload,
      );

      const accessToken = getJwtToken(
        cookieService.getAccessTokenCookieName(),
        response.headers["set-cookie"],
      );
      const refreshToken = getJwtToken(
        cookieService.getRefreshTokenCookieName(),
        response.headers["set-cookie"],
      );

      expect(status).toBe(200);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    test("should fail to log in if the user does not exist (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: "no@exist.com",
        password: testUser.password,
      };

      const { status } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.Login,
        loginPayload,
      );

      expect(status).toBe(401);
    });

    test("should fail to log in if the user's password is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: "P@sssw0rdInvalid2025",
      };

      const { status } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.Login,
        loginPayload,
      );

      expect(status).toBe(401);
    });
  });

  describe("/api/auth/refresh-access-token (POST)", () => {
    test("should issue a new access token (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData, status: loginStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.Login,
          loginPayload,
        );

      expect(loginStatus).toBe(200);
      expect(loginData.accessToken).toBeDefined();

      // Refresh
      const { data: refreshData, status: refreshStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.RefreshAccessToken,
          loginPayload,
          loginData.refreshToken,
        );

      expect(refreshStatus).toBe(200);
      // Access token je nový
      expect(refreshData.accessToken).toBeDefined();
      expect(refreshData.accessToken).not.toBe(loginData.accessToken);
      // Refresh token je rovnaký
      expect(refreshData.refreshToken).toBeDefined();
      expect(refreshData.refreshToken).toBe(loginData.refreshToken);
    });

    test("should fail to issue a new access if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData, status: loginStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.Login,
          loginPayload,
        );

      expect(loginStatus).toBeDefined();
      expect(loginData.accessToken).toBeDefined();

      // Refresh s neplatným tokenom
      const { status: refreshStatus } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.RefreshAccessToken,
        loginPayload,
        loginData.refreshToken + " invalid-token",
      );

      expect(refreshStatus).toBe(401);
    });
  });

  describe("/api/auth/refresh-tokens (POST)", () => {
    test("should refresh token pair (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData, status: loginStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.Login,
          loginPayload,
        );

      expect(loginStatus).toBe(200);
      expect(loginData.accessToken).toBeDefined();

      const { data: refreshData, status: refreshStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.RefreshTokens,
          loginPayload,
          loginData.refreshToken,
        );

      expect(refreshStatus).toBe(200);
      expect(refreshData.accessToken).toBeDefined();
      expect(refreshData.accessToken).not.toBe(loginData.accessToken);
      expect(refreshData.refreshToken).toBeDefined();
      expect(refreshData.refreshToken).not.toBe(loginData.refreshToken);
    });

    test("should fail to refresh token pair if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData, status: loginStatus } =
        await apiClient.post<AuthTokenPairDto>(
          AuthControllerUrl.Login,
          loginPayload,
        );

      expect(loginStatus).toBe(200);
      expect(loginData.accessToken).toBeDefined();

      const { status: refreshStatus } = await apiClient.post<AuthTokenPairDto>(
        AuthControllerUrl.RefreshTokens,
        loginPayload,
        loginData.refreshToken + "invalid-token",
      );

      expect(refreshStatus).toBe(401);
    });
  });
});
