import { beforeAll, describe, expect, it } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { USER_REPOSITORY } from "@repo/fm-domain";

import { PrismaContexProvider } from "../../../../src/modules/prisma/providers";
import {
  PrismaUserRepository,
  UserMapper,
} from "../../../../src/modules/prisma/repositories/prisma-user.repository";
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
          provide: PrismaContexProvider,
          useFactory: (prismaService: PrismaService) =>
            new PrismaContexProvider(undefined, prismaService),
          inject: [PrismaService],
        },
        {
          provide: USER_REPOSITORY,
          useFactory: (
            prismaContexProvider: PrismaContexProvider,
            mapper: UserMapper,
          ) => new PrismaUserRepository(prismaContexProvider, mapper),
          inject: [PrismaContexProvider, UserMapper],
        },
      ],
    }).compile();

    prismaService = moduleFixture.get(PrismaService);
    userRepository = moduleFixture.get(USER_REPOSITORY);
  });

  it("should init", async () => {
    expect(prismaService).toBeDefined();
    expect(userRepository).toBeDefined();

    const user = await userRepository.findById(
      "17e9961a-ca66-4ffe-b8b0-fed29c1afb21",
    );

    expect(user).toBeDefined();
  });
});
