import { ConflictException, Injectable, Provider } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import {
  CreateUser,
  IUserRepository,
  UpdateEntity,
  USER_REPOSITORY,
  User as UserEntity,
} from "@repo/fm-domain";
import { BaseMapper } from "@repo/fm-shared";

import { PrismaBaseRepository } from "./prisma-base.repository";
import { PrismaContextProvider as PrismaContextProvider } from "../providers";

type PrismaUserRepositoryType = PrismaBaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[],
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
  Prisma.UserInclude,
  Prisma.UserSelect,
  Prisma.UserUpdateInput
>;

@Injectable()
export class UserMapper extends BaseMapper {
  toDomain(userDao: User): UserEntity | null {
    if (!userDao) return null;

    return new UserEntity({
      ...userDao,
      userName: userDao.userName ?? undefined,
      phoneNumber: userDao.phoneNumber ?? undefined,
      lastLogin: userDao.lastLogin ?? undefined,
      deletedAt: userDao.deletedAt ?? undefined,
      createdAt: userDao.createdAt ?? undefined,
      updatedAt: userDao.updatedAt ?? undefined,
    });
  }
}

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private client: PrismaUserRepositoryType;

  constructor(
    prismaContextProvider: PrismaContextProvider,
    private readonly mapper: UserMapper,
  ) {
    this.client = new PrismaBaseRepository<
      User,
      Prisma.UserCreateInput,
      Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[],
      Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
      Prisma.UserInclude,
      Prisma.UserSelect,
      Prisma.UserUpdateInput
    >("user", prismaContextProvider);
  }

  async create(userPayload: CreateUser): Promise<UserEntity | null> {
    try {
      const data = {
        email: userPayload.email,
        passwordHash: userPayload.passwordHash,
        firstName: userPayload.firstName,
        lastName: userPayload.lastName,
        userName: userPayload.userName,
        verified: userPayload?.verified ?? false,
        disabled: userPayload?.disabled ?? false,
      };

      const prismaUser = await this.client.create(data);
      return this.mapper.toDomain(prismaUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("User with provided email already exists");
      }
      throw error;
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const prismaUser = await this.client.findById(id);
    return this.mapper.toDomain(prismaUser);
  }

  async update(
    userPayload: UpdateEntity<UserEntity>,
  ): Promise<UserEntity | null> {
    const { id } = userPayload;
    if (!id) {
      throw new Error("User ID is required for update");
    }
    const prismaUser = await this.client.update(id, {
      email: userPayload.email,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
      userName: userPayload.userName,
      phoneNumber: userPayload.phoneNumber,
    });
    return this.mapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<UserEntity | null> {
    const prismaUser = await this.client.delete(id);
    return this.mapper.toDomain(prismaUser);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await this.client.findUnique({ email });
    return this.mapper.toDomain(prismaUser);
  }
}

export const prismaUserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useClass: PrismaUserRepository,
};
