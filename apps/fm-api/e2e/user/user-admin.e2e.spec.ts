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
import { User } from "@repo/fm-db";
import { IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { generateCreateUserPayload } from "@repo/fm-mock-data";

import { UserDto } from "../../src/api/user/dtos/user.dto";
import { UserControllerUrl } from "../utils/api-url.config";
import { TestApiClient } from "../utils/test-api-client";
import { createTestApp } from "../utils/test-app";

describe("UserAdminController (e2e)", () => {
  let app: INestApplication;
  let apiClient: TestApiClient;
  let userRepository: IUserRepository;
  const testUsers: User[] = [];

  beforeAll(() => {});

  beforeEach(async () => {
    app = await createTestApp();
    apiClient = new TestApiClient(app);
    userRepository = app.get(USER_REPOSITORY);
  });

  afterAll(async () => {
    for (const testUser of testUsers) {
      await userRepository.delete(testUser.id);
    }
  });

  afterEach(async () => {
    await app.close();
  });

  describe("/api/user/create (POST)", () => {
    test("should create a new user and return the user data (201)", async () => {
      const createUserDto = generateCreateUserPayload();

      const { data } = await apiClient.post<UserDto>(
        UserControllerUrl.Create,
        createUserDto,
        201,
      );

      expect(data.id).toBeDefined();
      expect(data.email).toEqual(createUserDto.email);
      expect(data.userName).toEqual(createUserDto.userName);
      expect(data.firstName).toEqual(createUserDto.firstName);
      expect(data.lastName).toEqual(createUserDto.lastName);
      testUsers.push(data as unknown as User);
    });

    test("should fail when creating a user with an already used email (409)", async () => {
      const createUserDto = generateCreateUserPayload();

      // Create user
      await apiClient.post<UserDto>(
        UserControllerUrl.Create,
        createUserDto,
        201,
      );

      // Try create user with same email
      const { status } = await apiClient.post<UserDto>(
        UserControllerUrl.Create,
        createUserDto,
        409,
      );

      expect(status).toBe(409);
    });

    test("should fail creating user when password is missing (422)", async () => {
      const createUserDto = generateCreateUserPayload();

      const { status } = await apiClient.post<UserDto>(
        UserControllerUrl.Create,
        { ...createUserDto, password: undefined },
        422,
      );

      expect(status).toBe(422);
    });
  });
});
