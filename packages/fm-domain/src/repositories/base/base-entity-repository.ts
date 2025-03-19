import { PartialDeep } from "type-fest";

import { BaseEntity } from "../../entities";

export type BaseEntityCreateOmitKeys = "id" | "createdAt" | "updatedAt";
export type BaseEntityUpdateOmitKeys = "createdAt" | "updatedAt";
export type CreateEntity<TEntity> = Omit<
  PartialDeep<TEntity>,
  BaseEntityCreateOmitKeys
>;
export type UpdateEntity<TEntity> = Omit<
  PartialDeep<TEntity>,
  BaseEntityUpdateOmitKeys
>;

export interface IBaseEntityRepository<
  TEntity extends BaseEntity,
  TCreateEntity = CreateEntity<TEntity>,
  TUpdateEntity = UpdateEntity<TEntity>,
> {
  create(entity: TCreateEntity): Promise<TEntity>;
  findById(id: TEntity["id"]): Promise<TEntity>;
  update(entity: TUpdateEntity): Promise<TEntity>;
  delete(id: TEntity["id"]): Promise<TEntity>;
}
