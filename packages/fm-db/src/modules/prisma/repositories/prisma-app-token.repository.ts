import { Injectable, NotFoundException, Provider } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { AppToken, Prisma } from "@prisma/client";
import {
  APP_TOKEN_REPOSITORY,
  AppToken as AppTokenEntity,
  AppTokenType as AppTokenEntityType,
  IAppTokenRepository,
  UpdateEntity,
} from "@repo/fm-domain";
import { BaseMapper, mapEnumValue } from "@repo/fm-shared";

import { PrismaBaseRepository } from "./prisma-base.repository";

type PrismaAppTokenRepositoryType = PrismaBaseRepository<
  AppToken,
  Prisma.AppTokenCreateInput,
  Prisma.AppTokenCreateManyInput | Prisma.AppTokenCreateManyInput[],
  Prisma.AppTokenWhereInput | Prisma.AppTokenWhereUniqueInput,
  Prisma.AppTokenInclude,
  Prisma.AppTokenSelect,
  Prisma.AppTokenUpdateInput
>;

export type CreateAppToken = {
  publicId: string;
  value: string;
  expiresAt: Date;
  userId: string;
};

@Injectable()
export class AppTokenMapper extends BaseMapper {
  toDomain(appTokenDao: AppToken): AppTokenEntity | null {
    if (!appTokenDao) return null;
    return new AppTokenEntity({
      ...appTokenDao,
      value: appTokenDao.value ?? undefined,
      expiresAt: appTokenDao.expiresAt ?? undefined,
      revokedAt: appTokenDao.revokedAt ?? undefined,
      type: mapEnumValue(appTokenDao.type, AppTokenEntityType),
    });
  }
}

@Injectable()
export class PrismaAppTokenRepository implements IAppTokenRepository {
  private entityName = "AppToken";
  private client: PrismaAppTokenRepositoryType;

  constructor(
    protected txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly mapper: AppTokenMapper,
  ) {
    this.client = new PrismaBaseRepository<
      AppToken,
      Prisma.AppTokenCreateInput,
      Prisma.AppTokenCreateManyInput | Prisma.AppTokenCreateManyInput[],
      Prisma.AppTokenWhereInput | Prisma.AppTokenWhereUniqueInput,
      Prisma.AppTokenInclude,
      Prisma.AppTokenSelect,
      Prisma.AppTokenUpdateInput
    >(this.entityName, txHost);
  }

  async create(tokenPayload: CreateAppToken): Promise<AppTokenEntity | null> {
    const token = await this.client.create({
      publicId: tokenPayload.publicId,
      value: tokenPayload.value ?? undefined,
      expiresAt: tokenPayload.expiresAt,
      user: {
        connect: { id: tokenPayload.userId },
      },
    });

    return this.mapper.toDomain(token);
  }

  async findById(id: string): Promise<AppTokenEntity | null> {
    const token = await this.client.findById(id);
    return this.mapper.toDomain(token);
  }

  async findToken(
    userId: string,
    publicId: string,
  ): Promise<AppTokenEntity | null> {
    const tokens = await this.client.findMany(
      { userId, publicId }, // where
      undefined, // include
      undefined, // select
      {
        // options
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    );

    const token = tokens?.length >= 1 ? tokens[0] : null;

    if (!token) throw new NotFoundException("Token not found");

    return this.mapper.toDomain(token);
  }

  async update(
    tokenPayload: UpdateEntity<AppToken>,
  ): Promise<AppTokenEntity | null> {
    if (!tokenPayload.id) {
      throw new Error("Token ID is required for update");
    }
    const token = await this.client.update(tokenPayload.id, {
      publicId: tokenPayload.publicId,
      value: tokenPayload.value ?? undefined,
      expiresAt: tokenPayload.expiresAt,
    });
    return this.mapper.toDomain(token);
  }

  async delete(id: string): Promise<AppTokenEntity | null> {
    const token = await this.client.delete(id);
    return this.mapper.toDomain(token);
  }

  async revokeToken(
    userId: string,
    publicId: string,
  ): Promise<AppTokenEntity | null> {
    const token = await this.findToken(userId, publicId);

    if (token) {
      const revokedToken = await this.client.updateWhere(
        {
          revoked: true,
        },
        { id: token.id },
      );
      return this.mapper.toDomain(revokedToken);
    } else {
      throw new NotFoundException("Token not found");
    }
  }
}

export const prismaAppTokenProvider: Provider = {
  provide: APP_TOKEN_REPOSITORY,
  useClass: PrismaAppTokenRepository,
};
