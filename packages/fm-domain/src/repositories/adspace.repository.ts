import { AdSpace } from "../entities";
import { IBaseEntityPaginationRepository } from "./base/base-entity-pagination.repository";

export interface IAdSpaceRepository
  extends IBaseEntityPaginationRepository<AdSpace> {}

export const AD_SPACE_REPOSITORY = Symbol("AD_SPACE_REPOSITORY");
