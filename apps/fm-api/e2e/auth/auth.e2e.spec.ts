import { INestApplication } from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";
import request from "supertest";

import { LoginRequestDto } from "../../src/api/auth/dto";
import { AuthControlerUrl } from "../utils/api-url.config";
import { getJwtToken } from "../utils/cookie-utils";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

describe("AuthControler (e2e)", () => {
  let app: INestApplication;
  let testUser: TestUser;

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  beforeEach(async () => {
    app = await createTestApp();
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

      await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        });
    });

    it("should log in and set the authentication cookie (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const cookieService = app.get(AuthCookieService);

      await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ headers }) => {
          const accessToken = getJwtToken(
            cookieService.getAccessTokenCookieName(),
            headers["set-cookie"],
          );
          const refreshToken = getJwtToken(
            cookieService.getRefreshTokenCookieName(),
            headers["set-cookie"],
          );

          expect(accessToken).toBeDefined();
          expect(refreshToken).toBeDefined();
        });
    });

    it("should fail to log in if the user does not exist (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: "no@exist.com",
        password: testUser.password,
      };

      await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(401);
    });

    it("should fail to log in if the user's password is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: "P@sssw0rdInvalid2025",
      };

      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send(loginPayload)
        .expect(401);
    });
  });

  describe("/api/auth/refesh-access-token (POST)", () => {
    it("should issue a new acesss token (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const loginRes = await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
        });

      //refresh
      await request(app.getHttpServer())
        .post(AuthControlerUrl.RefreshAccessToken)
        .set("Authorization", "Bearer " + loginRes.body.refreshToken)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          //! access token is new
          expect(body.accessToken).toBeDefined();
          expect(body.accessToken).not.toBe(loginRes.body.accessToken);
          //! refresh token is same
          expect(body.refreshToken).toBeDefined();
          expect(body.refreshToken).toBe(loginRes.body.refreshToken);
        });
    });

    it("should fail to issue a new access if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const loginRes = await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
        });

      //refresh
      await request(app.getHttpServer())
        .post(AuthControlerUrl.RefreshAccessToken)
        .set(
          "Authorization",
          "Bearer " + loginRes.body.refreshToken + " invalid-token",
        )
        .send(loginPayload)
        .expect(401);
    });
  });

  describe("/api/auth/refresh-tokens (POST)", () => {
    it("should refresh token pair (200)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };
      const loginRes = await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
        });

      await request(app.getHttpServer())
        .post(AuthControlerUrl.RefreshTokens)
        .set("Authorization", "Bearer " + loginRes.body.refreshToken)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
          expect(body.accessToken).not.toBe(loginRes.body.accessToken);
          expect(body.refreshToken).toBeDefined();
          expect(body.refreshToken).not.toBe(loginRes.body.refreshToken);
        });
    });

    it("should fail to refresh token pair if refresh token is invalid (401)", async () => {
      const loginPayload: LoginRequestDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const loginRes = await request(app.getHttpServer())
        .post(AuthControlerUrl.Login)
        .send(loginPayload)
        .expect(200)
        .expect(({ body }) => {
          expect(body.accessToken).toBeDefined();
        });

      await request(app.getHttpServer())
        .post(AuthControlerUrl.RefreshTokens)
        .set(
          "Authorization",
          "Bearer " + loginRes.body.refreshToken + "invalid-token",
        )
        .send(loginPayload)
        .expect(401);
    });
  });
});
