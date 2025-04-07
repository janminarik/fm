import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@repo/fm-db";
import {
  AD_SPACE_REPOSITORY,
  AdSpaceVisibility,
  IAdSpaceRepository,
} from "@repo/fm-domain";
import { createAdSpace } from "@repo/fm-mock-data";
import { generateId } from "@repo/nest-common";
import { PaginationResponseDto } from "src/common/dto";

import { AdSpaceDto, UpdateAdSpaceDto } from "../../src/api/adspace/dto";
import { AuthTokenPairDto } from "../../src/api/auth/dto/auth-token-pair.dto";
import {
  AdSpaceControllerUrl,
  AuthControlerUrl,
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
    const { data } = await apiClient.post<AuthTokenPairDto>(
      AuthControlerUrl.Login,
      {
        email: testUser.email,
        password: testUser.password,
      },
      200,
    );

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
    it("should create an ad space and return data (200)", async () => {
      accessToken = accessToken = await login();

      const createAdSpaceDto = createAdSpace();

      const { data } = await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        createAdSpaceDto,
        201,
        accessToken,
      );

      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(createAdSpaceDto.name);
      expect(data.type).toBe(createAdSpaceDto.type);
      expect(data.visibility).toBe(createAdSpaceDto.visibility);
      expect(data.address).toBeDefined();
    });

    it("should fail to create an ad space if request is invalid (422)", async () => {
      accessToken = await login();

      await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        {},
        422,
        accessToken,
      );
    });

    it("should fail to create an ad space if user is unathorized (401)", async () => {
      const createAdSpaceDto = createAdSpace();

      await apiClient.post<AdSpaceDto>(
        AdSpaceControllerUrl.Create,
        createAdSpaceDto,
        401,
      );
    });
  });

  describe("/api/adspace/list  (GET)", () => {
    it("should return paginated list of ad spaces (200)", async () => {
      await seedDb();

      accessToken = await login();

      const { data } = await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        AdSpaceControllerUrl.List,
        200,
        accessToken,
      );

      expect(data.data).toBeDefined();
      expect(data.meta).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);
    });

    it("should fail to return paginated list of ad spaces if query is invalid (422)", async () => {
      accessToken = await login();

      await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        `${AdSpaceControllerUrl.List}?sortOrder=ABC`,
        422,
        accessToken,
      );
    });

    it("should fail to return paginated list of ad spaces if user is unathorized (404)", async () => {
      await apiClient.get<PaginationResponseDto<AdSpaceDto>>(
        AdSpaceControllerUrl.List,
        401,
      );
    });
  });

  describe("/api/adspace/:id  (GET)", () => {
    it("should successfully return  an existing ad space (200)", async () => {
      await insertAdSpaceInDb();

      accessToken = await login();

      const { data } = await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/${adSpaceId}`,
        200,
        accessToken,
      );

      expect(data).toBeDefined();
      expect(data.id).toBe(adSpaceId);
    });

    it("should fail when trying to get a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/${fakeAdSpaceId}`,
        404,
        accessToken,
      );
    });

    it("should fail to get an ad space with invalid ID (422)", async () => {
      accessToken = await login();

      await apiClient.get<AdSpaceDto>(
        `${AdSpaceControllerUrl.Get}/1234546`,
        422,
        accessToken,
      );
    });

    it("should fail to get ad space if user is unathorized (401)", async () => {
      await insertAdSpaceInDb();
      accessToken = await login();

      await apiClient.get(`${AdSpaceControllerUrl.Get}/${adSpaceId}`, 401);
    });
  });

  describe("/api/adspace/:id  (PATCH)", () => {
    it("should successfully update an existing ad space (200)", async () => {
      await insertAdSpaceInDb();

      accessToken = await login();

      const updateAdSpaceDto: UpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      const { data } = await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        updateAdSpaceDto,
        200,
        accessToken,
      );

      expect(data).toBeDefined();
      expect(data.name).toBe(updateAdSpaceDto.name);
      expect(data.visibility).toBe(updateAdSpaceDto.visibility);
    });

    it("should fail when trying to update a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${fakeAdSpaceId}`,
        updateAdSpaceDto,
        404,
        accessToken,
      );
    });

    it("should fail when updating an ad space with invalid data (422)", async () => {
      await insertAdSpaceInDb();

      accessToken = await login();

      const invalidUpdateAdSpaceDto = {
        name: "awesome ad space",
        visibility: "NORMAL",
      };

      await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        invalidUpdateAdSpaceDto,
        422,
        accessToken,
      );
    });

    it("should reject update when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDb();

      accessToken = await login();

      const updateAdSpaceDto = {
        name: "awesome ad space",
        visibility: AdSpaceVisibility.HIGH,
      };

      await apiClient.patch<AdSpaceDto>(
        `${AdSpaceControllerUrl.Update}/${adSpaceId}`,
        updateAdSpaceDto,
        401,
      );
    });
  });

  describe("/api/adspace/:id  (DELETE)", () => {
    it("should successfully delete an existing ad space (204)", async () => {
      await insertAdSpaceInDb();

      accessToken = await login();

      await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${adSpaceId}`,
        undefined,
        204,
        accessToken,
      );
    });

    it("should fail when attempting to delete a non-existent ad space (404)", async () => {
      const fakeAdSpaceId = generateId();

      accessToken = await login();

      await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${fakeAdSpaceId}`,
        undefined,
        404,
        accessToken,
      );
    });

    it("should fail when attempting to delete with an invalid ad space ID format(422)", async () => {
      accessToken = await login();

      await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/1234546`,
        undefined,
        422,
        accessToken,
      );
    });

    it("should reject deletion when the user is unauthorized (401)", async () => {
      await insertAdSpaceInDb();
      accessToken = await login();

      await apiClient.delete(
        `${AdSpaceControllerUrl.Delete}/${adSpaceId}`,
        undefined,
        401,
      );
    });
  });
});
