import { INestApplication } from "@nestjs/common";

import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import { UserDto } from "../../src/api/user/dtos/user.dto";
import { AuthControlerUrl, UserControllerUrl } from "../utils/api-url.config";
import { TestApiClient } from "../utils/test-api-client";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

describe("UserSharedController (e2e)", () => {
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

  describe("/api/user/profile (GET)", () => {
    it("should get a user profile - auth header - (200)", async () => {
      const loginRes = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        {
          email: testUser.email,
          password: testUser.password,
        },
        200,
      );

      expect(loginRes.accessToken).toBeDefined();

      const accessToken = loginRes.accessToken;

      const profileRes = await apiClient.get<UserDto>(
        UserControllerUrl.Profile,
        200,
        accessToken,
      );

      expect(profileRes.id).toEqual(testUser.id);
      expect(profileRes.email).toEqual(testUser.email);
      expect(profileRes.userName).toEqual(testUser.userName);
    });

    it("should get a user profile - auth cookie - (200)", async () => {
      const loginRes = await apiClient.post<AuthTokenPairDto>(
        AuthControlerUrl.Login,
        {
          email: testUser.email,
          password: testUser.password,
        },
        200,
      );

      expect(loginRes.accessToken).toBeDefined();

      const accessToken = loginRes.accessToken;

      const profileRes = await apiClient.get<UserDto>(
        UserControllerUrl.Profile,
        200,
        accessToken,
      );

      expect(profileRes.id).toEqual(testUser.id);
      expect(profileRes.email).toEqual(testUser.email);
      expect(profileRes.userName).toEqual(testUser.userName);
    });

    it("should fail get a user profile when user is unathorized (404)", async () => {
      await apiClient.get(UserControllerUrl.Profile, 401);
    });
  });
});
