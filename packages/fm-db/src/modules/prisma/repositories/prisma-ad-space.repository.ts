import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable, Provider } from "@nestjs/common";
import {
  AdSpace,
  AdSpaceStatus,
  AdSpaceType,
  AdSpaceVisibility,
  Prisma,
} from "@prisma/client";
import {
  AD_SPACE_REPOSITORY,
  AdSpace as AdSpaceEntity,
  AdSpaceStatus as AdSpaceEntityStatus,
  AdSpaceType as AdSpaceEntityType,
  AdSpaceVisibility as AdSpaceEntityVisibility,
  IAdSpaceRepository,
  IListPaginationParams,
  IListPaginationResult,
  UpdateEntity,
} from "@repo/fm-domain";

import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { BaseMapper, mapEnumValue } from "@repo/fm-shared";
import { PartialDeep } from "type-fest";
import { PrismaBaseRepository } from "./prisma-base.repository";

type AdSpaceRepositoryType = PrismaBaseRepository<
  AdSpace,
  Prisma.AdSpaceCreateInput,
  Prisma.AdSpaceCreateManyInput | Prisma.AdSpaceCreateManyInput[],
  Prisma.AdSpaceWhereInput | Prisma.AdSpaceWhereUniqueInput,
  Prisma.AdSpaceInclude,
  Prisma.AdSpaceSelect,
  Prisma.AdSpaceUpdateInput
>;

@Injectable()
export class AdSpaceMapper extends BaseMapper {
  toDomain(adSpaceDao: AdSpace): AdSpaceEntity {
    if (!adSpaceDao) return null;

    return new AdSpaceEntity({
      ...adSpaceDao,
      type: mapEnumValue(adSpaceDao.type, AdSpaceEntityType),
      status: mapEnumValue(adSpaceDao.status, AdSpaceEntityStatus),
      visibility: mapEnumValue(adSpaceDao.visibility, AdSpaceEntityVisibility),
    });
  }
}

@Injectable()
export class AdSpaceRepository implements IAdSpaceRepository {
  private client: AdSpaceRepositoryType;

  constructor(
    protected txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly mapper: AdSpaceMapper,
  ) {
    this.client = new PrismaBaseRepository<
      AdSpace,
      Prisma.AdSpaceCreateInput,
      Prisma.AdSpaceCreateManyInput | Prisma.AdSpaceCreateManyInput[],
      Prisma.AdSpaceWhereInput | Prisma.AdSpaceWhereUniqueInput,
      Prisma.AdSpaceInclude,
      Prisma.AdSpaceSelect,
      Prisma.AdSpaceUpdateInput
    >("adSpace", txHost);
  }

  async listPagination(
    paginationParams: IListPaginationParams,
  ): Promise<IListPaginationResult<AdSpaceEntity>> {
    const prismaAdSpaces: IListPaginationResult<AdSpace> =
      await this.client.listPagination(paginationParams, {
        address: true,
        contents: true,
        maintenance: true,
      });

    const adSpaces = prismaAdSpaces.data.map((prismaAdSpace) =>
      this.mapper.toDomain(prismaAdSpace),
    );

    return { ...prismaAdSpaces, data: adSpaces };
  }

  async create(
    adSpacePayload: PartialDeep<AdSpaceEntity>,
  ): Promise<AdSpaceEntity> {
    const { address } = adSpacePayload;

    const prismaCreateAdSpace = {
      name: adSpacePayload.name,
      type: mapEnumValue(adSpacePayload.type, AdSpaceType),
      status: mapEnumValue(adSpacePayload.status, AdSpaceStatus),
      visibility: mapEnumValue(adSpacePayload.visibility, AdSpaceVisibility),
      address: {
        create: {
          street: address.street,
          city: address.city,
          postalcode: address.postalcode,
          country: address.country,
        },
      },
    };

    const prismaAdSpace = await this.client.create(prismaCreateAdSpace, {
      address: true,
    });

    const adSpace = this.mapper.toDomain(prismaAdSpace);

    return adSpace;
  }

  async findById(id: string): Promise<AdSpaceEntity> {
    const prismaAdSpace = await this.client.findById(id);
    return this.mapper.toDomain(prismaAdSpace);
  }
  async update(
    adSpacePayload: UpdateEntity<AdSpaceEntity>,
  ): Promise<AdSpaceEntity> {
    const { id, address } = adSpacePayload;

    const prismaUpdateAdSpace: Prisma.AdSpaceUpdateInput = {
      name: adSpacePayload.name,
      type: mapEnumValue(adSpacePayload.type, AdSpaceType),
      status: mapEnumValue(adSpacePayload.status, AdSpaceStatus),
      visibility: mapEnumValue(adSpacePayload.visibility, AdSpaceVisibility),
      ...(address && {
        address: {
          update: address,
        },
      }),
    };

    const prismaAdSpace = await this.client.update(id, prismaUpdateAdSpace, {
      address: true,
    });

    const adSpace = this.mapper.toDomain(prismaAdSpace);

    return adSpace;
  }

  async delete(id: string): Promise<AdSpaceEntity> {
    const prismaAdSpace = await this.client.delete(id);
    return this.mapper.toDomain(prismaAdSpace);
  }
}

export const prismaAdSpaceRepositoryProvider: Provider = {
  provide: AD_SPACE_REPOSITORY,
  useClass: AdSpaceRepository,
};
