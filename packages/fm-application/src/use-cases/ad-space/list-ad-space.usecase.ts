import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  AD_SPACE_REPOSITORY,
  AdSpace,
  type IAdSpaceRepository,
  type IListPaginationParams,
  IListPaginationResult,
} from "@repo/fm-domain";

import { IBaseUseCase } from "../../common";

@Injectable()
export class ListAdSpaceUseCase implements IBaseUseCase {
  constructor(
    @Inject(AD_SPACE_REPOSITORY)
    private readonly adSpaceRepository: IAdSpaceRepository,
  ) {}

  @Transactional()
  async execute(
    paginationParams: IListPaginationParams,
  ): Promise<IListPaginationResult<AdSpace>> {
    return await this.adSpaceRepository.listPagination(paginationParams);
  }
}
