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

    it("should throw ConflictException when user with email already exist", async () => {
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

  describe("findById", () => {
    it("should find user by ID", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const createdUser = await userRepository.create({
        ...userData,
        passwordHash,
      });

      const foundUser = await userRepository.findById(createdUser?.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser?.id);
      expect(foundUser?.email).toBe(createdUser?.email);
    });

    it("should return null whene user with ID does not exist", async () => {
      const user = await userRepository.findById("123");
      expect(user).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const createdUser = await userRepository.create({
        ...userData,
        passwordHash,
      });

      const foundUser = await userRepository.findUserByEmail(
        createdUser?.email,
      );

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(createdUser?.email);
    });
  });

  describe("update", () => {
    it("should update user properties", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const createdUser = await userRepository.create({
        ...userData,
        passwordHash,
      });

      const updateData = {
        id: createdUser.id,
        firstName: "UpdatedName",
        lastName: "UpdatedLastName",
        phoneNumber: "+421123456789",
      };

      const updatedUser = await userRepository.update(updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.phoneNumber).toBe(updateData.phoneNumber);
    });
  });

  describe("delete", () => {
    it("should delete a user by ID", async () => {
      const { password, ...userData } = createUserPayload();
      const hashService = new HashService();
      const passwordHash = await hashService.hash(password);

      const createdUser = await userRepository.create({
        ...userData,
        passwordHash,
      });

      const deletedUser = await userRepository.delete(createdUser.id);

      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(createdUser.id);

      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(userInDb).toBeNull();
    });
  });
});
