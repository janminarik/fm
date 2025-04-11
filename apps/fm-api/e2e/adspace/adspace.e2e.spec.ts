import {
  jest,
  test,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  afterEach,
} from "@jest/globals";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@repo/fm-db";
import {
  AD_SPACE_REPOSITORY,
  AdSpaceVisibility,
  IAdSpaceRepository,
} from "@repo/fm-domain";
import { generateCreateAdSpacePayload } from "@repo/fm-mock-data";
import { generateId } from "@repo/nest-common";

import { AdSpaceDto, UpdateAdSpaceDto } from "../../src/api/adspace/dto";
import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import { PaginationResponseDto } from "../../src/common/dto/pagination";
import {
  AdSpaceControllerUrl,
  AuthControllerUrl,
} from "../utils/api-url.config";
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

  async function insertAdSpaceInDatabase() {
    const adSpaceData = generateCreateAdSpacePayload();
    const adSpace = await adSpaceRepository.create(adSpaceData);
    adSpaceId = adSpace ? adSpace.id : null;
  }

  async function seedDatabase(adSpaceCount: number = 15) {
    for (let i = 0; i < adSpaceCount; i++) {
      await insertAdSpaceInDatabase();
    }
  }

  async function login(): Promise<string> {
    const { data, status } = await apiClient.post<AuthTokenPairDto>(
      AuthControllerUrl.Login,
      {
        email: testUser.email,
        password: testUser.password,
      },
    );

    expect(status).toBe(200);
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();

    return data.accessToken;
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
    test("should create an ad space and return data (201)", async () => {
      accessToken = await login();

      const createAdSpaceDto = generateCreateAdSpacePayload();

      const { status, data } = await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        createAdSpaceDto,
        accessToken,
      );

      expect(status).toBe(201);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(createAdSpaceDto.name);
      expect(data.type).toBe(createAdSpaceDto.type);
      expect(data.visibility).toBe(createAdSpaceDto.visibility);
      expect(data.address).toBeDefined();
    });

    test("should fail to create an ad space if request is invalid (422)", async () => {
      accessToken = await login();

      const { status } = await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        {},
        accessToken,
      );

      expect(status).toBe(422);
    });

    test("should fail to create an ad space if user is unauthorized (401)", async () => {
      const createAdSpaceDto = generateCreateAdSpacePayload();

      const { status } = await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        createAdSpaceDto,
      );

      expect(status).toBe(401);
    });
  });

  describe("/api/adspace/list  (GET)", () => {
    test("should return paginated list of ad spaces (200)", async () => {
      await seedDatabase();

      accessToken = await login();

      const { data } = await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        AdSpaceControllerUrl.List,
        accessToken,
      );

      expect(data.data).toBeDefined();
      expect(data.meta).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);
    });

    test("should fail to return paginated list of ad spaces if query is invalid (422)", async () => {
      accessToken = await login();

      const { status } = await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        `${AdSpaceControllerUrl.List}?sortOrder=ABC`,
        accessToken,
      );

      expect(status).toBe(422);
    });

    test("should fail to return paginated list of ad spaces if user is unauthorized (401)", async () => {
      const { status } = await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        AdSpaceControllerUrl.List,
      );

      expect(status).toBe(401);
    });
  });

  describe("/api/adspace/:id  (GET)", () => {
    test("should successfully return  an existing ad space (200)", async () => {
      await insertAdSpaceInDatabase();

      accessToken = await login();

      const { data } = await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/${adSpaceId}`,
        accessToken,
      );

      expect(data).toBeDefined();
      expect(data.id).toBe(adSpaceId);
    });

    test("should fail when trying to get a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      const { status } = await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/${fakeAdSpaceId}`,
        accessToken,
      );

      expect(status).toBe(404);
    });

    test("should fail to get an ad space with invalid ID (422)", async () => {
      accessToken = await login();

      const { status } = await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/1234546`,
        accessToken,
      );

      expect(status).toBe(422);
    });

    test("should fail to get ad space if user is unauthorized (401)", async () => {
      await insertAdSpaceInDatabase();
      accessToken = await login();

      const { status } = await apiClient.get(
        `${AdSpaceControllerUrl.Get}/${adSpaceId}`,
      );

      expect(status).toBe(401);
    });
  });

  describe("/api/adspace/:id  (PATCH)", () => {
    test("should successfully update an existing ad space (200)", async () => {
      await insertAdSpaceInDatabase();

      accessToken = await login();

      const updateAdSpaceDto: UpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      const { data, status } = await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        updateAdSpaceDto,
        accessToken,
      );

      expect(status).toBe(200);
      expect(data).toBeDefined();
      expect(data.name).toBe(updateAdSpaceDto.name);
      expect(data.name).toBe(updateAdSpaceDto.name);
      expect(data.visibility).toBe(updateAdSpaceDto.visibility);
    });

    test("should fail when trying to update a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      const { status } = await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${fakeAdSpaceId}`,
        updateAdSpaceDto,
        accessToken,
      );

      expect(status).toBe(404);
    });

    test("should fail when updating an ad space with invalid data (422)", async () => {
      await insertAdSpaceInDatabase();

      accessToken = await login();

      const invalidUpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: "NORMAL",
      };

      const { status } = await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        invalidUpdateAdSpaceDto,
        accessToken,
      );

      expect(status).toBe(422);
    });

    test("should reject update when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDatabase();

      accessToken = await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      const { status } = await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        updateAdSpaceDto,
      );

      expect(status).toBe(401);
    });
  });

  describe("/api/adspace/:id  (DELETE)", () => {
    test("should successfully delete an existing ad space (204)", async () => {
      await insertAdSpaceInDatabase();

      accessToken = await login();

      const { status } = await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${adSpaceId}`,
        undefined,
        accessToken,
      );

      expect(status).toBe(204);
    });

    test("should fail when attempting to delete a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      const { status } = await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${fakeAdSpaceId}`,
        undefined,
        accessToken,
      );

      expect(status).toBe(404);
    });

    test("should fail when attempting to delete with an invalid ad space ID format(422)", async () => {
      accessToken = await login();

      const { status } = await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/1234546`,
        undefined,
        accessToken,
      );

      expect(status).toBe(422);
    });

    test("should reject deletion when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDatabase();
      accessToken = await login();

      const { status } = await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${adSpaceId}`,
        undefined,
      );

      expect(status).toBe(401);
    });
  });
});
