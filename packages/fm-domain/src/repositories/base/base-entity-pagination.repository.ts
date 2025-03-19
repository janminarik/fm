import {
  CreateEntity,
  IBaseEntityRepository,
  UpdateEntity,
} from "./base-entity-repository";
import { BaseEntity } from "../../entities";

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface IListPaginationParams {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: SortDirection;
  filter?: string;
}

export interface IPaginationMeta {
  count: number;
  total: number;
  page: number;
  totalPage: number;
}

export interface IListPaginationResult<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IBaseEntityPaginationRepository<
  TEntity extends BaseEntity,
  TCreateEntity = CreateEntity<TEntity>,
  TUpdateEntity = UpdateEntity<TEntity>,
> extends IBaseEntityRepository<TEntity, TCreateEntity, TUpdateEntity> {
  listPagination(
    paginationParams: IListPaginationParams,
  ): Promise<IListPaginationResult<TEntity>>;
}
