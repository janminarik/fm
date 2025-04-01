import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  AD_SPACE_REPOSITORY,
  AdSpace,
  type IAdSpaceRepository,
} from "@repo/fm-domain";

import { IBaseUseCase } from "../../common";

@Injectable()
export class DeleteAdSpaceUseCase implements IBaseUseCase {
  constructor(
    @Inject(AD_SPACE_REPOSITORY)
    private readonly adSpaceRepository: IAdSpaceRepository,
  ) {}

  @Transactional()
  async execute(id: string): Promise<AdSpace | null> {
    const adSpace = await this.adSpaceRepository.findById(id);

    if (!adSpace) throw new NotFoundException("Ad space not found");

    return await this.adSpaceRepository.delete(id);
  }
}
