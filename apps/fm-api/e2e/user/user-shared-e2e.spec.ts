import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { LoginRequestDto } from "../../src/api/auth/dto";
import { AuthControlerUrl, UserControllerUrl } from "../utils/api-url.config";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

describe("UserSharedController (e2e)", () => {
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

  describe("/api/user/profile (GET)", () => {
    it("should get a user profile - auth header -  (200)", async () => {
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

      const accessToken = loginRes.body.accessToken;

      await request(app.getHttpServer())
        .get(UserControllerUrl.Profile)
        .set("Authorization", "Bearer " + accessToken)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(testUser.id);
          expect(body.email).toEqual(testUser.email);
          expect(body.userName).toEqual(testUser.userName);
          expect(body.password).toBeUndefined();
        });
    });

    it("should get a user profile - auth cookie - (200)", async () => {
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

      const accessToken = loginRes.body.accessToken;

      await request(app.getHttpServer())
        .get(UserControllerUrl.Profile)
        .set("Authorization", "Bearer " + accessToken)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(testUser.id);
          expect(body.email).toEqual(testUser.email);
          expect(body.userName).toEqual(testUser.userName);
          expect(body.password).toBeUndefined();
        });
    });

    it("should fail get a user profile when user is unathorized (404)", async () => {
      await request(app.getHttpServer())
        .get(UserControllerUrl.Profile)
        .expect(401);
    });
  });
});
