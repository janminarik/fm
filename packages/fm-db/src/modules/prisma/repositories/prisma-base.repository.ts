import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Prisma } from "@prisma/client";

import {
  IListPaginationParams,
  IListPaginationResult,
  IPaginationMeta,
  SortDirection,
} from "@repo/fm-domain";
import { DEFAULT_SORT_ATTRIBUTE } from "../../../constants/query";
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
  constructor(
    protected entityName: string,
    protected txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

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

    let where: TWhere;

    if (paginationParams.filter)
      where = parseFilterQuery<TWhere>(paginationParams.filter);

    const findArgs = {
      where,
      ...orderOptions,
      ...pageOptions,
      ...{ include },
    };

    const [data, total] = await Promise.all([
      this.txHost.tx[this.entityName].findMany(findArgs),
      this.txHost.tx[this.entityName].count({ where }),
    ]);

    const meta: IPaginationMeta = {
      count: data?.length,
      total: total,
      page: page,
      totalPage: Math.ceil(total / limit),
    };

    return {
      meta,
      data,
    };
  }

  async create(
    data: TCreate,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.txHost.tx[this.entityName].create({
      data,
      include,
      select,
    });
  }

  async createMany(data: TCreateMany): Promise<TEntity[]> {
    await this.txHost.tx[this.entityName].findMany({ where: {} });

    return await this.txHost.tx[this.entityName].createMany({
      data,
    });
  }

  async findById(id: string): Promise<TEntity> {
    return await this.txHost.tx[this.entityName].findUnique({
      where: { id },
    });
  }

  async findUnique(where: TWhere): Promise<TEntity> {
    return await this.txHost.tx[this.entityName].findUnique({ where });
  }

  async findMany(
    where?: TWhere,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity[]> {
    return await this.txHost.tx[this.entityName].findMany({
      where,
      select,
      include,
    });
  }

  async update(
    id: string,
    data: TUpdate,
    include?: TInclude,
    select?: TSelect,
  ): Promise<TEntity> {
    return await this.txHost.tx[this.entityName].update({
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
    return await this.txHost.tx[this.entityName].update({
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
    return await this.txHost.tx[this.entityName].delete({
      where: { id, ...where },
      include,
      select,
    });
  }

  async deleteBatch(
    ids: string[],
    where?: TWhere,
  ): Promise<Prisma.BatchPayload> {
    return await this.txHost.tx[this.entityName].deleteMany({
      where: {
        id: {
          in: ids,
        },
        ...where,
      },
    });
  }
}
