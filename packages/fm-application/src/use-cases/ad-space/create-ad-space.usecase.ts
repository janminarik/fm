import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  AD_SPACE_REPOSITORY,
  AdSpace,
  AdSpaceStatus,
  AdSpaceType,
  AdSpaceVisibility,
  type IAdSpaceRepository,
} from "@repo/fm-domain";

import { IBaseUseCase } from "../../common";

export type CreateAddressPayload = {
  street: string;
  city: string;
  postalcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type CreateAdSpacePayload = {
  name: string;
  type: AdSpaceType;
  status: AdSpaceStatus;
  visibility: AdSpaceVisibility;
  address: CreateAddressPayload;
};

@Injectable()
export class CreateAdSpaceUseCase implements IBaseUseCase {
  constructor(
    @Inject(AD_SPACE_REPOSITORY)
    private readonly adSpaceRepository: IAdSpaceRepository,
  ) {}

  @Transactional()
  async execute(adSpacePayload: CreateAdSpacePayload): Promise<AdSpace> {
    return await this.adSpaceRepository.create(adSpacePayload);
  }
}
