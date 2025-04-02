import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CreateUser, USER_REPOSITORY } from "@repo/fm-domain";
import { createUserPayload, TEST_DEFAULT_USER } from "@repo/fm-mock-data";
import { HashService } from "@repo/fm-shared";

import { UserMapper } from "../../../../src/modules/prisma/mappers";
import { PrismaContextProvider } from "../../../../src/modules/prisma/providers";
import { PrismaUserRepository } from "../../../../src/modules/prisma/repositories/prisma-user.repository";
import { PrismaService } from "../../../../src/modules/prisma/services/prisma.service";

describe("PrismaUserRepository (Integration)", () => {
  let prismaService: PrismaService;
  let userRepository: PrismaUserRepository;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
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
    userRepository = moduleFixture.get(USER_REPOSITORY);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        email: {
          not: TEST_DEFAULT_USER,
        },
      },
    });
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it("should init", () => {
    expect(prismaService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const createdUser = await userRepository.create({
        ...userData,
        passwordHash,
      });

      expect(createdUser).toBeDefined();
      expect(createdUser?.email).toBe(userData.email);
      expect(createdUser?.firstName).toBe(userData.firstName);
      expect(createdUser?.lastName).toBe(userData.lastName);
      expect(createdUser?.passwordHash).toBe(passwordHash);
    });

    it("shoudl throw ConflictException when user with email already exist", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const duplicateEmail = TEST_DEFAULT_USER;

      const payload: CreateUser = {
        ...userData,
        email: duplicateEmail,
        passwordHash,
      };

      await expect(userRepository.create(payload)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
