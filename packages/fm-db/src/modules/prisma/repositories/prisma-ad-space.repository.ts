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
  CreateAdSpace,
  IAdSpaceRepository,
  IListPaginationParams,
  IListPaginationResult,
  UpdateEntity,
} from "@repo/fm-domain";
import { mapEnumValue } from "@repo/fm-shared";

import { PrismaBaseRepository } from "./prisma-base.repository";
import { AdSpaceMapper } from "../mappers";
import { PrismaContextProvider } from "../providers";

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
export class AdSpaceRepository implements IAdSpaceRepository {
  private client: AdSpaceRepositoryType;
  constructor(
    private readonly prismaContextProvider: PrismaContextProvider,
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
    >("adSpace", prismaContextProvider);
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

    const adSpaces = prismaAdSpaces.data
      .map((prismaAdSpace) => this.mapper.toDomain(prismaAdSpace))
      .filter((adSpace): adSpace is AdSpaceEntity => adSpace !== null);

    return { ...prismaAdSpaces, data: adSpaces };
  }

  async create(adSpacePayload: CreateAdSpace): Promise<AdSpaceEntity | null> {
    const { address } = adSpacePayload;

    const prismaCreateAdSpace = {
      name: adSpacePayload.name,
      type: mapEnumValue(adSpacePayload.type, AdSpaceType),
      status: mapEnumValue(adSpacePayload.status, AdSpaceStatus),
      visibility: mapEnumValue(adSpacePayload.visibility, AdSpaceVisibility),
      address: {
        create: {
          street: address?.street,
          city: address?.city,
          postalcode: address?.postalcode,
          country: address?.country,
        },
      },
    };

    const prismaAdSpace = await this.client.create(prismaCreateAdSpace, {
      address: true,
    });

    const adSpace = this.mapper.toDomain(prismaAdSpace);

    return adSpace;
  }

  async findById(id: string): Promise<AdSpaceEntity | null> {
    const prismaAdSpace = await this.client.findById(id);
    return this.mapper.toDomain(prismaAdSpace);
  }
  async update(
    adSpacePayload: UpdateEntity<AdSpaceEntity>,
  ): Promise<AdSpaceEntity | null> {
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

  async delete(id: string): Promise<AdSpaceEntity | null> {
    const prismaAdSpace = await this.client.delete(id);
    return this.mapper.toDomain(prismaAdSpace);
  }
}

export const prismaAdSpaceRepositoryProvider: Provider = {
  provide: AD_SPACE_REPOSITORY,
  useClass: AdSpaceRepository,
};
