import { INestApplication } from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";

import { LoginRequestDto } from "../../src/api/auth/dto";
import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import { AuthControlerUrl } from "../utils/api-url.config";
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
    it("should log in and return a JWT token if user credentials are valid (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });

    it("should log in and set the authentication cookie (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const cookieService = app.get(AuthCookieService);

      const { response } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      const accessToken = getJwtToken(
        cookieService.getAccessTokenCookieName(),
        response.headers["set-cookie"],
      );
      const refreshToken = getJwtToken(
        cookieService.getRefreshTokenCookieName(),
        response.headers["set-cookie"],
      );

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it("should fail to log in if the user does not exist (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: "no@exist.com",
        password: testUser.password,
      };

      await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        401,
      );
    });

    it("should fail to log in if the user's password is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: "P@sssw0rdInvalid2025",
      };

      await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        401,
      );
    });
  });

  describe("/api/auth/refesh-access-token (POST)", () => {
    it("should issue a new acesss token (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      expect(loginData.accessToken).toBeDefined();

      // Refresh
      const { data: refreshData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.RefreshAccessToken,
        loginPayload,
        200,
        loginData.refreshToken,
      );

      // Access token je nový
      expect(refreshData.accessToken).toBeDefined();
      expect(refreshData.accessToken).not.toBe(loginData.accessToken);
      // Refresh token je rovnaký
      expect(refreshData.refreshToken).toBeDefined();
      expect(refreshData.refreshToken).toBe(loginData.refreshToken);
    });

    it("should fail to issue a new access if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      expect(loginData.accessToken).toBeDefined();

      // Refresh s neplatným tokenom
      await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.RefreshAccessToken,
        loginPayload,
        401,
        loginData.refreshToken + " invalid-token",
      );
    });
  });

  describe("/api/auth/refresh-tokens (POST)", () => {
    it("should refresh token pair (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      expect(loginData.accessToken).toBeDefined();

      const { data: refreshData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.RefreshTokens,
        loginPayload,
        200,
        loginData.refreshToken,
      );

      expect(refreshData.accessToken).toBeDefined();
      expect(refreshData.accessToken).not.toBe(loginData.accessToken);
      expect(refreshData.refreshToken).toBeDefined();
      expect(refreshData.refreshToken).not.toBe(loginData.refreshToken);
    });

    it("should fail to refresh token pair if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data: loginData } = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        loginPayload,
        200,
      );

      expect(loginData.accessToken).toBeDefined();

      await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.RefreshTokens,
        loginPayload,
        401,
        loginData.refreshToken + "invalid-token",
      );
    });
  });
});
