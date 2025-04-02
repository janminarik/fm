import { Prisma, PrismaClient } from "@prisma/client";
import {
  IListPaginationParams,
  IListPaginationResult,
  IPaginationMeta,
  SortDirection,
} from "@repo/fm-domain";

import { DEFAULT_SORT_ATTRIBUTE } from "../../../constants/query";
import { isTransactionHost, PrismaContexProvider } from "../providers";
import { parseFilterQuery } from "../utils";

export interface IPrismaBaseRepository<
  TEntity extends Record<string, any>,
  TCreate extends Record<string, any>,
  TCreateMany extends Record<string, any>,
  TWhere extends Record<string, any>,
  TInclude extends Record<string, any>,
  TSelect extends Record<string, any>,
  TUpdate extends Record<string, any>,
> {
  listPagination(
    paginationParams: IListPaginationParams,
    include?: TInclude,
  ): Promise<IListPaginationResult<TEntity>>;
  create(data: TCreate, include?: TInclude, select?: TSelect): Promise<TEntity>;
  createMany(data: TCreateMany): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity>;
  findUnique(where: TWhere): Promise<TEntity>;
  findMany(
    where?: TWhere,
    include?: TInclude,
    select?: TSelect,
    options?: {
      orderBy?: any;
      take?: number;
      skip?: number;
    },
  ): Promise<TEntity[]>;
  update(
    id: string,
    data: TUpdate,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity>;
  updateWhere(
    data: TUpdate,
    where: TWhere,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity>;
  delete(
    id: string,
    where?: TWhere,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity>;
  deleteBatch(ids: string[], where?: TWhere): Promise<Prisma.BatchPayload>;
}

// Typ pre Prisma model delegate
type PrismaModelDelegate<TEntity, TCreate, TCreateMany, TUpdate, TWhere> = {
  findMany: (args: any) => Promise<TEntity[]>;
  findUnique: (args: any) => Promise<TEntity>;
  create: (args: {
    data: TCreate;
    include?: any;
    select?: any;
  }) => Promise<TEntity>;
  createMany: (args: {
    data: TCreateMany;
    skipDuplicates?: boolean;
  }) => Promise<any>;
  update: (args: {
    where: any;
    data: TUpdate;
    include?: any;
    select?: any;
  }) => Promise<TEntity>;
  delete: (args: {
    where: any;
    include?: any;
    select?: any;
  }) => Promise<TEntity>;
  deleteMany: (args: { where: any }) => Promise<Prisma.BatchPayload>;
  count: (args: any) => Promise<number>;
};

export class PrismaBaseRepository<
  TEntity extends Record<string, any>,
  TCreate extends Record<string, any>,
  TCreateMany extends Record<string, any>,
  TWhere extends Record<string, any>,
  TInclude extends Record<string, any>,
  TSelect extends Record<string, any>,
  TUpdate extends Record<string, any>,
> implements
    IPrismaBaseRepository<
      TEntity,
      TCreate,
      TCreateMany,
      TWhere,
      TInclude,
      TSelect,
      TUpdate
    >
{
  private readonly delegate: PrismaModelDelegate<
    TEntity,
    TCreate,
    TCreateMany,
    TUpdate,
    TWhere
  >;

  constructor(
    protected entityName: string,
    protected prismaContextProvider: PrismaContexProvider,
  ) {
    const prismaContext = prismaContextProvider.getContext();

    if (!prismaContext) {
      throw new Error(
        "Either TransactionHost or PrismaService must be provided",
      );
    }

    // Rozlíšenie medzi TransactionHost a PrismaClient
    if (isTransactionHost(prismaContext)) {
      // Ak je to TransactionHost, použijeme tx
      this.delegate = prismaContext.tx[
        entityName as keyof typeof prismaContext.tx
      ] as unknown as PrismaModelDelegate<
        TEntity,
        TCreate,
        TCreateMany,
        TUpdate,
        TWhere
      >;
    } else {
      // Ak je to PrismaClient, použijeme ho priamo
      this.delegate = prismaContext[
        entityName as keyof PrismaClient
      ] as unknown as PrismaModelDelegate<
        TEntity,
        TCreate,
        TCreateMany,
        TUpdate,
        TWhere
      >;
    }
  }

  async listPagination(
    paginationParams: IListPaginationParams,
    include?: TInclude,
  ): Promise<IListPaginationResult<TEntity>> {
    const limit = paginationParams.limit ?? 10;
    const page = paginationParams.page || 0;
    const offset = limit * page;

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const sortBy = paginationParams.sortBy ?? DEFAULT_SORT_ATTRIBUTE;
    const sortOrder =
      paginationParams?.sortOrder == SortDirection.DESC ? "desc" : "asc";

    const orderOptions = {
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    let where: TWhere | undefined;

    if (paginationParams.filter)
      where = parseFilterQuery<TWhere>(paginationParams.filter);

    const findArgs = {
      where,
      ...orderOptions,
      ...pageOptions,
      ...{ include },
    };

    const [data, total] = await Promise.all([
      this.delegate.findMany(findArgs),
      this.delegate.count({ where }),
    ]);

    const meta: IPaginationMeta = {
      count: data?.length ?? 0,
      total: total,
      page: page,
      totalPage: Math.ceil(total / limit),
    };

    return {
      meta,
      data,
    } as IListPaginationResult<TEntity>;
  }

  async create(
    data: TCreate,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.delegate.create({
      data,
      include,
      select,
    });
  }

  async createMany(data: TCreateMany): Promise<TEntity[]> {
    await this.delegate.findMany({ where: {} });

    return (await this.delegate.createMany({
      data,
    })) as unknown as TEntity[];
  }

  async findById(id: string): Promise<TEntity> {
    return await this.delegate.findUnique({
      where: { id },
    });
  }

  async findUnique(where: TWhere): Promise<TEntity> {
    return await this.delegate.findUnique({ where });
  }

  async findMany(
    where?: TWhere,
    include?: TInclude,
    select?: TSelect,
    options?: {
      orderBy?: any;
      take?: number;
      skip?: number;
    },
  ): Promise<TEntity[]> {
    return await this.delegate.findMany({
      where,
      include,
      select,
      ...(options || {}), // Pridanie options ako orderBy, take, atď.
    });
  }

  async update(
    id: string,
    data: TUpdate,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.delegate.update({
      where: { id },
      data,
      include,
      select,
    });
  }

  async updateWhere(
    data: TUpdate,
    where: TWhere,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.delegate.update({
      where,
      data,
      include,
      select,
    });
  }

  async delete(
    id: string,
    where?: TWhere,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.delegate.delete({
      where: { id, ...where },
      include,
      select,
    });
  }

  async deleteBatch(
    ids: string[],
    where?: TWhere,
  ): Promise<Prisma.BatchPayload> {
    return await this.delegate.deleteMany({
      where: {
        id: {
          in: ids,
        },
        ...where,
      },
    });
  }
}
