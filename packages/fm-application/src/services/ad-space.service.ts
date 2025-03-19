import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  AD_SPACE_REPOSITORY,
  AdSpace,
  AdSpaceStatus,
  AdSpaceType,
  AdSpaceVisibility,
  IAdSpaceRepository,
  IListPaginationParams,
} from "@repo/fm-domain";

//! obsolete

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

export type UpdateAdSpacePayload = {
  name?: string;
  type?: AdSpaceType;
  status?: AdSpaceStatus;
  visibility?: AdSpaceVisibility;
};

@Injectable()
export class AdSpaceService {
  private logger = new Logger(AdSpaceService.name);

  constructor(
    @Inject(AD_SPACE_REPOSITORY)
    private readonly adSpaceRepository: IAdSpaceRepository,
  ) {}

  @Transactional()
  async listPagination(paginationParams: IListPaginationParams) {
    return await this.adSpaceRepository.listPagination(paginationParams);
  }

  @Transactional()
  async findOne(id: string): Promise<AdSpace> {
    return await this.adSpaceRepository.findById(id);
  }

  @Transactional()
  async create(adSpacePayload: CreateAdSpacePayload): Promise<AdSpace> {
    return await this.adSpaceRepository.create(adSpacePayload);
  }

  @Transactional()
  async update(
    id: string,
    adSpacePayload: UpdateAdSpacePayload,
  ): Promise<AdSpace> {
    return await this.adSpaceRepository.update({ ...adSpacePayload, id });
  }

  @Transactional()
  async delete(id: string): Promise<AdSpace> {
    return await this.adSpaceRepository.delete(id);
  }
}
