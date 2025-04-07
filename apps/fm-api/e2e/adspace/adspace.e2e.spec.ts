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

import { AdSpaceDto, UpdateAdSpaceDto } from "../../src/api/adspace/dto";
import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import { AdSpaceControllerUrl } from "../utils/api-url.config";
import { TestApiClient } from "../utils/test-api-client";
import {
  createTestApp,
  createTestUser,
  deleteTestUser,
  TestUser,
} from "../utils/test-app";

//! TODO:  remove
jest.setTimeout(300000);

describe("AdSpaceController (e2e)", () => {
  let app: INestApplication;
  let apiClient: TestApiClient;
  let adSpaceRepository: IAdSpaceRepository;
  let prismaService: PrismaService;
  let testUser: TestUser;
  let accessToken: string | null;
  let adSpaceId: string | null;

  async function insertAdSpaceInDb() {
    const adSpaceData = createAdSpace();
    const adSpace = await adSpaceRepository.create(adSpaceData);
    adSpaceId = adSpace ? adSpace.id : null;
  }

  async function seedDb(adSpaceCount: number = 15) {
    for (let i = 0; i < adSpaceCount; i++) {
      await insertAdSpaceInDb();
    }
  }

  async function login(): Promise<string> {
    const response = await apiClient.post<AuthTokenPairDto>(
      "/api/v1/auth/login",
      {
        email: testUser.email,
        password: testUser.password,
      },
      200,
    );

    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();

    return response.accessToken;
  }

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  beforeEach(async () => {
    app = await createTestApp();
    apiClient = new TestApiClient(app);
    adSpaceRepository = app.get<IAdSpaceRepository>(AD_SPACE_REPOSITORY);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await deleteTestUser(testUser.id);
    await prismaService.adSpace.deleteMany();
    await app.close();
  });

  afterEach(async () => {
    accessToken = null;
    await app.close();
  });

  describe("/api/adspace (POST)", () => {
    it("should create an ad space and return data (200)", async () => {
      accessToken = await login();

      const createAdSpaceDto = createAdSpace();

      const response = await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        createAdSpaceDto,
        201,
        accessToken,
      );

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toBe(createAdSpaceDto.name);
      expect(response.type).toBe(createAdSpaceDto.type);
      expect(response.visibility).toBe(createAdSpaceDto.visibility);
      expect(response.address).toBeDefined();
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
          const typedResponse = body as PaginatedResponse<AdSpaceResponse>;
          expect(typedResponse.data).toBeDefined();
          expect(typedResponse.meta).toBeDefined();
          expect(typedResponse.data.length).toBeGreaterThan(0);
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
          const typedBody = body as AdSpaceResponse;
          expect(typedBody).toBeDefined();
          expect(typedBody.id).toBe(adSpaceId);
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
          const typedBody = body as AdSpaceResponse;
          expect(typedBody).toBeDefined();
          expect(typedBody.name).toBe(updateAdSpaceDto.name);
          expect(typedBody.visibility).toBe(updateAdSpaceDto.visibility);
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
