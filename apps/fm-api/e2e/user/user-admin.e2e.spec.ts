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
          expect(body.id).toBeDefined();
          expect(body.email).toEqual(createUserDto.email);
          expect(body.userName).toEqual(createUserDto.userName);
          expect(body.firstName).toEqual(createUserDto.firstName);
          expect(body.lastName).toEqual(createUserDto.lastName);
          testUsers.push(body);
        });
    });

    it("should fail when creating a user with an already used email (409)", async () => {
      const createUserDto = createUserPayload();
      //create user
      request(app.getHttpServer())
        .post(UserControllerUrl.Create)
        .send(createUserDto)
        .expect(201);

      //try create user
      request(app.getHttpServer())
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
