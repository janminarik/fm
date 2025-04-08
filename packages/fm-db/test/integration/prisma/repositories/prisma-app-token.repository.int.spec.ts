import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { APP_TOKEN_REPOSITORY, USER_REPOSITORY } from "@repo/fm-domain";
import {
  createAppTokenPayload,
  createUserPayload,
  TEST_DEFAULT_USER,
} from "@repo/fm-mock-data";
import { HashService } from "@repo/fm-shared";

import {
  AppTokenMapper,
  UserMapper,
} from "../../../../src/modules/prisma/mappers";
import { PrismaContextProvider } from "../../../../src/modules/prisma/providers";
import { PrismaAppTokenRepository } from "../../../../src/modules/prisma/repositories/prisma-app-token.repository";
import { PrismaUserRepository } from "../../../../src/modules/prisma/repositories/prisma-user.repository";
import { PrismaService } from "../../../../src/modules/prisma/services/prisma.service";

describe("PrismaAppTokenRepository (Integration)", () => {
  let prismaService: PrismaService;
  let appTokenRepository: PrismaAppTokenRepository;
  let userRepository: PrismaUserRepository;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        AppTokenMapper,
        UserMapper,
        {
          provide: PrismaService,
          useValue: new PrismaService(
            "postgresql://postgres:postgres@localhost:5432/flowmate-e2e?schema=public",
          ),
        },
        {
          provide: PrismaContextProvider,
          useFactory: (prismaService: PrismaService) =>
            new PrismaContextProvider(undefined, prismaService),
          inject: [PrismaService],
        },
        {
          provide: APP_TOKEN_REPOSITORY,
          useFactory: (
            prismaContexProvider: PrismaContextProvider,
            mapper: AppTokenMapper,
          ) => new PrismaAppTokenRepository(prismaContexProvider, mapper),
          inject: [PrismaContextProvider, AppTokenMapper],
        },
        {
          provide: USER_REPOSITORY,
          useFactory: (
            prismaContexProvider: PrismaContextProvider,
            mapper: UserMapper,
          ) => new PrismaUserRepository(prismaContexProvider, mapper),
          inject: [PrismaContextProvider, UserMapper],
        },
      ],
    }).compile();

    prismaService = moduleFixture.get(PrismaService);
    appTokenRepository = moduleFixture.get(APP_TOKEN_REPOSITORY);
    userRepository = moduleFixture.get(USER_REPOSITORY);

    const user = await userRepository.findUserByEmail(TEST_DEFAULT_USER);
    userId = user.id;
  });

  beforeEach(async () => {
    await prismaService.appToken.deleteMany({
      where: {},
    });
  });

  afterAll(async () => {
    await prismaService.appToken.deleteMany({
      where: {},
    });
    await prismaService.$disconnect();
  });

  it("should init", () => {
    expect(prismaService).toBeDefined();
    expect(appTokenRepository).toBeDefined();
  });

  describe("create", () => {
    it("should create a new app token", async () => {
      const tokenData = createAppTokenPayload({ userId });

      const createdToken = await appTokenRepository.create(tokenData);

      expect(createdToken).toBeDefined();
      expect(createdToken?.publicId).toBe(tokenData.publicId);
      expect(createdToken?.value).toBe(tokenData.value);
      expect(createdToken?.userId).toBe(userId);
      expect(createdToken?.expiresAt).toEqual(tokenData.expiresAt);
    });
  });

  describe("findById", () => {
    it("should find token by ID", async () => {
      const tokenData = createAppTokenPayload({ userId });

      const createdToken = await appTokenRepository.create(tokenData);

      const foundToken = await appTokenRepository.findById(createdToken?.id);

      expect(foundToken).toBeDefined();
      expect(foundToken?.id).toBe(createdToken?.id);
      expect(foundToken?.publicId).toBe(createdToken?.publicId);
    });

    it("should return null when token with ID does not exist", async () => {
      const token = await appTokenRepository.findById("non-existent-id");
      expect(token).toBeNull();
    });
  });

  describe("findToken", () => {
    it("should find token by userId and publicId", async () => {
      const publicId = "test-public-id";
      const tokenData = createAppTokenPayload({
        userId,
        publicId,
      });

      await appTokenRepository.create(tokenData);

      const foundToken = await appTokenRepository.findToken(userId, publicId);

      expect(foundToken).toBeDefined();
      expect(foundToken?.publicId).toBe(publicId);
      expect(foundToken?.userId).toBe(userId);
    });

    it("should throw NotFoundException when token does not exist", async () => {
      await expect(
        appTokenRepository.findToken(userId, "non-existent-public-id"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update token properties", async () => {
      const tokenData = createAppTokenPayload({ userId });

      const createdToken = await appTokenRepository.create(tokenData);

      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 30); // 30 days from now

      const updateData = {
        id: createdToken.id,
        publicId: "updated-public-id",
        expiresAt: newExpiresAt,
      };

      const updatedToken = await appTokenRepository.update(updateData);

      expect(updatedToken).toBeDefined();
      expect(updatedToken?.publicId).toBe(updateData.publicId);
      expect(updatedToken?.expiresAt).toEqual(updateData.expiresAt);
      // Ensure other properties remain unchanged
      expect(updatedToken?.value).toBe(createdToken.value);
      expect(updatedToken?.userId).toBe(createdToken.userId);
    });

    it("should throw error when id is not provided", async () => {
      await expect(appTokenRepository.update({} as any)).rejects.toThrow(
        "Token ID is required for update",
      );
    });
  });

  describe("delete", () => {
    it("should delete a token by ID", async () => {
      const tokenData = createAppTokenPayload({ userId });

      const createdToken = await appTokenRepository.create(tokenData);

      const deletedToken = await appTokenRepository.delete(createdToken.id);

      expect(deletedToken).toBeDefined();
      expect(deletedToken?.id).toBe(createdToken.id);

      // Verify token is actually deleted from database
      const tokenInDb = await prismaService.appToken.findUnique({
        where: { id: createdToken.id },
      });
      expect(tokenInDb).toBeNull();
    });
  });

  describe("revokeToken", () => {
    it("should revoke a token by userId and publicId", async () => {
      const publicId = "token-to-revoke";
      const tokenData = createAppTokenPayload({
        userId,
        publicId,
      });

      await appTokenRepository.create(tokenData);

      const revokedToken = await appTokenRepository.revokeToken(
        userId,
        publicId,
      );

      expect(revokedToken).toBeDefined();
      expect(revokedToken?.revoked).toBe(true);

      // Verify token is revoked in database
      const tokenInDb = await prismaService.appToken.findFirst({
        where: {
          userId,
          publicId,
        },
      });
      expect(tokenInDb?.revoked).toBe(true);
    });

    it("should throw NotFoundException when trying to revoke non-existent token", async () => {
      await expect(
        appTokenRepository.revokeToken(userId, "non-existent-public-id"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
