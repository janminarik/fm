import { INestApplication } from "@nestjs/common";
import { User } from "@repo/fm-db";
import { IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { createUserPayload } from "@repo/fm-mock-data";
import request from "supertest";

import { UserControllerUrl } from "../utils/api-url.config";
import { createTestApp } from "../utils/test-app";

describe("UserAdminController (e2e)", () => {
  let app: INestApplication;
  let userRepository: IUserRepository;
  const testUsers: User[] = [];

  beforeAll(() => {});

  beforeEach(async () => {
    app = await createTestApp();
    userRepository = app.get(USER_REPOSITORY);
  });

  afterAll(async () => {
    testUsers.forEach(async (testUser) => {
      await userRepository.delete(testUser.id);
    });
  });

  afterEach(async () => {
    await app.close();
  });

  describe("/api/user/create (POST)", () => {
    it("should create a new user and return the user data (201)", async () => {
      const createUserDto = createUserPayload();
      await request(app.getHttpServer())
        .post(UserControllerUrl.Create)
        .send(createUserDto)
        .expect(201)
        .expect(({ body }) => {
          const userId = (body as { id: string }).id;
          const email = (body as { email: string }).email;
          const userName = (body as { userName: string }).userName;
          const firstName = (body as { firstName: string }).firstName;
          const lastName = (body as { lastName: string }).lastName;
          expect(userId).toBeDefined();
          expect(email).toEqual(createUserDto.email);
          expect(userName).toEqual(createUserDto.userName);
          expect(firstName).toEqual(createUserDto.firstName);
          expect(lastName).toEqual(createUserDto.lastName);
          testUsers.push(body);
        });
    });

    it("should fail when creating a user with an already used email (409)", async () => {
      const createUserDto = createUserPayload();
      //create user
      await request(app.getHttpServer())
        .post(UserControllerUrl.Create)
        .send(createUserDto)
        .expect(201);

      //try create user
      await request(app.getHttpServer())
        .post(UserControllerUrl.Create)
        .send(createUserDto)
        .expect(409);
    });

    it("should fail creating user when password is missing (422)", async () => {
      const createUserDto = createUserPayload();
      await request(app.getHttpServer())
        .post(UserControllerUrl.Create)
        .send({ ...createUserDto, password: undefined })
        .expect(422);
    });
  });
});
