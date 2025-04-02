import { PartialDeep } from "type-fest";

import { BaseEntity, ID } from "../../entities";

export type BaseEntityCreateOmitKeys = "id" | "createdAt" | "updatedAt";
export type BaseEntityUpdateOmitKeys = "createdAt" | "updatedAt";
export type CreateEntity<TEntity> = Omit<
  PartialDeep<TEntity>,
  BaseEntityCreateOmitKeys
>;
export type UpdateEntity<TEntity> = Omit<
  PartialDeep<TEntity>,
  BaseEntityUpdateOmitKeys
> & { id: ID };

export interface IBaseEntityRepository<
  TEntity extends BaseEntity,
  TCreateEntity = CreateEntity<TEntity>,
  TUpdateEntity = UpdateEntity<TEntity>,
> {
  create(entity: TCreateEntity): Promise<TEntity | null>;
  findById(id: TEntity["id"]): Promise<TEntity | null>;
  update(entity: TUpdateEntity): Promise<TEntity | null>;
  delete(id: TEntity["id"]): Promise<TEntity | null>;
}
