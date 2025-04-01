import { AdSpace } from "../entities";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "../enums";
import { IBaseEntityPaginationRepository } from "./base/base-entity-pagination.repository";

export type CreateAdSpace = {
  name: string;
  type: AdSpaceType;
  status: AdSpaceStatus;
  visibility: AdSpaceVisibility;
  address: {
    street: string;
    city: string;
    postalcode: string;
    country: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAdSpaceRepository
  extends IBaseEntityPaginationRepository<AdSpace, CreateAdSpace> {}

export const AD_SPACE_REPOSITORY = Symbol("AD_SPACE_REPOSITORY");
