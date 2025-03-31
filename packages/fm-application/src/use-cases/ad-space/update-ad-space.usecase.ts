import { Inject, Injectable, NotFoundException } from "@nestjs/common";
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

export type UpdateAdSpacePayload = {
  name?: string;
  type?: AdSpaceType;
  status?: AdSpaceStatus;
  visibility?: AdSpaceVisibility;
};

@Injectable()
export class UpdateAdSpaceUseCase implements IBaseUseCase {
  constructor(
    @Inject(AD_SPACE_REPOSITORY)
    private readonly adSpaceRepository: IAdSpaceRepository,
  ) {}

  @Transactional()
  async execute(
    id: string,
    adSpacePayload: UpdateAdSpacePayload,
  ): Promise<AdSpace> {
    const adSpace = await this.adSpaceRepository.findById(id);
    if (!adSpace) throw new NotFoundException("Ad space not found");

    return await this.adSpaceRepository.update({ ...adSpacePayload, id });
  }
}
