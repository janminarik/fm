import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@repo/fm-db";
import {
  AD_SPACE_REPOSITORY,
  AdSpaceVisibility,
  IAdSpaceRepository,
} from "@repo/fm-domain";
import { createAdSpace } from "@repo/fm-mock-data";
import { generateId } from "@repo/nest-common";
import request from "supertest";

import { UpdateAdSpaceDto } from "../../src/api/adspace/dto";
import { LoginRequestDto } from "../../src/api/auth/dto";
import { AdSpaceControllerUrl } from "../utils/api-url.config";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

describe("AdSpaceController (e2e)", () => {
  let app: INestApplication;
  let adSpaceRepository: IAdSpaceRepository;
  let prismaService: PrismaService;
  let testUser: TestUser;
  let accessToken: string;
  let adSpaceId: string;

  async function insertAdSpaceInDb() {
    const adSpaceData = createAdSpace();
    const adSpace = await adSpaceRepository.create(adSpaceData);
    adSpaceId = adSpace.id;
  }

  async function seedDb(adSpaceCount: number = 15) {
    for (let i = 0; i < adSpaceCount; i++) {
      await insertAdSpaceInDb();
    }
  }

  async function login() {
    const loginPayload: LoginRequestDto = {
      email: testUser.email,
      password: testUser.password,
    };

    const loginRes = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send(loginPayload)
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
      });

    accessToken = loginRes.body.accessToken;
  }

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  beforeEach(async () => {
    app = await createTestApp();
    adSpaceRepository = app.get(AD_SPACE_REPOSITORY);
    prismaService = app.get(PrismaService);
  });

  afterAll(async () => {
    await deleteTestUser(testUser.id);
    await prismaService.adSpace.deleteMany();
    await app.close();
  });

  afterEach(async () => {
    accessToken = undefined;
    await app.close();
  });

  describe("/api/adspace (POST)", () => {
    it("should create an ad space and return data (200)", async () => {
      await login();

      const createAdSpaceDto = createAdSpace();

      await request(app.getHttpServer())
        .post(AdSpaceControllerUrl.Create)
        .send(createAdSpaceDto)
        .set("Authorization", "Bearer " + accessToken)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toBeDefined();
          expect(body.name).toBe(createAdSpaceDto.name);
          expect(body.type).toBe(createAdSpaceDto.type);
          expect(body.visibility).toBe(createAdSpaceDto.visibility);
          expect(body.address).toBeDefined();
        });
    });

    it("should fail to create an ad space if request is invalid (422)", async () => {
      await login();

      await request(app.getHttpServer())
        .post(AdSpaceControllerUrl.Create)
        .send({})
        .set("Authorization", "Bearer " + accessToken)
        .expect(422);
    });

    it("should fail to create an ad space if user is unathorized (401)", async () => {
      const createAdSpaceDto = createAdSpace();

      await request(app.getHttpServer())
        .post(AdSpaceControllerUrl.Create)
        .send(createAdSpaceDto)
        .expect(401);
    });
  });

  describe("/api/adspace/list  (GET)", () => {
    it("should return paginated list of ad spaces (200)", async () => {
      await seedDb();

      await login();

      await request(app.getHttpServer())
        .get(AdSpaceControllerUrl.List)
        .set("Authorization", "Bearer " + accessToken)
        .expect(200)
        .expect(({ body }) => {
          expect(body.data).toBeDefined();
          expect(body.meta).toBeDefined();
          expect(body.data.length).toBeGreaterThan(0);
        });
    });

    it("should fail to return paginated list of ad spaces if query is invalid (422)", async () => {
      await login();

      await request(app.getHttpServer())
        .get("/api/v1/adspace/list?sortOrder=ABC")
        .set("Authorization", "Bearer " + accessToken)
        .expect(422);
    });

    it("should fail to return paginated list of ad spaces if user is unathorized (404)", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/adspace/list")
        .expect(401);
    });
  });

  describe("/api/adspace/:id  (GET)", () => {
    it("should successfully return  an existing ad space (200)", async () => {
      await insertAdSpaceInDb();

      await login();

      await request(app.getHttpServer())
        .get(`${AdSpaceControllerUrl.Get}/${adSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toBe(adSpaceId);
        });
    });

    it("should fail when trying to get a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      await login();

      await request(app.getHttpServer())
        .get(`${AdSpaceControllerUrl.Get}/${fakeAdSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(404);
    });

    it("should fail to get an ad space with invalid ID (422)", async () => {
      await login();

      await request(app.getHttpServer())
        .get(`${AdSpaceControllerUrl.Get}/1234546`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(422);
    });

    it("should fail to get ad space if user is unathorized (401)", async () => {
      await insertAdSpaceInDb();
      await login();

      await request(app.getHttpServer())
        .get(`${AdSpaceControllerUrl.Get}/${adSpaceId}`)
        .expect(401);
    });
  });

  describe("/api/adspace/:id  (PATCH)", () => {
    it("should successfully update an existing ad space (200)", async () => {
      await insertAdSpaceInDb();

      await login();

      const updateAdSpaceDto: UpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      await request(app.getHttpServer())
        .patch(`${AdSpaceControllerUrl.Update}/${adSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .send(updateAdSpaceDto)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.name).toBe(updateAdSpaceDto.name);
          expect(body.visibility).toBe(updateAdSpaceDto.visibility);
        });
    });

    it("should fail when trying to update a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      await request(app.getHttpServer())
        .patch(`${AdSpaceControllerUrl.Update}/${fakeAdSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .send(updateAdSpaceDto)
        .expect(404);
    });

    it("should fail when updating an ad space with invalid data (422)", async () => {
      await insertAdSpaceInDb();

      await login();

      const invalidUpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: "NORMAL",
      };

      await request(app.getHttpServer())
        .patch(`${AdSpaceControllerUrl.Update}/${adSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .send(invalidUpdateAdSpaceDto)
        .expect(422);
    });

    it("should reject update when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDb();

      await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      await request(app.getHttpServer())
        .patch(`${AdSpaceControllerUrl.Update}/${adSpaceId}`)
        .send(updateAdSpaceDto)
        .expect(401);
    });
  });

  describe("/api/adspace/:id  (DELETE)", () => {
    it("should successfully delete an existing ad space (204)", async () => {
      await insertAdSpaceInDb();

      await login();

      await request(app.getHttpServer())
        .delete(`${AdSpaceControllerUrl.Delete}/${adSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(204);
    });

    it("should fail when attempting to delete a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      await login();

      await request(app.getHttpServer())
        .delete(`${AdSpaceControllerUrl.Delete}/${fakeAdSpaceId}`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(404);
    });

    it("should fail when attempting to delete with an invalid ad space ID format(422)", async () => {
      await login();

      await request(app.getHttpServer())
        .delete(`${AdSpaceControllerUrl.Delete}/1234546`)
        .set("Authorization", "Bearer " + accessToken)
        .expect(422);
    });

    it("should reject deletion when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDb();
      await login();

      await request(app.getHttpServer())
        .delete(`${AdSpaceControllerUrl.Delete}/${adSpaceId}`)
        .expect(401);
    });
  });
});
