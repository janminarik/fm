import { Injectable } from "@nestjs/common";
import { AdSpace } from "@prisma/client";
import {
  AdSpace as AdSpaceEntity,
  AdSpaceStatus as AdSpaceEntityStatus,
  AdSpaceType as AdSpaceEntityType,
  AdSpaceVisibility as AdSpaceEntityVisibility,
} from "@repo/fm-domain";
import { BaseMapper, mapEnumValue } from "@repo/fm-shared";

@Injectable()
export class AdSpaceMapper extends BaseMapper {
  toDomain(adSpaceDao: AdSpace): AdSpaceEntity | null {
    if (!adSpaceDao) return null;

    return new AdSpaceEntity({
      ...adSpaceDao,
      type: mapEnumValue(adSpaceDao.type, AdSpaceEntityType),
      status: mapEnumValue(adSpaceDao.status, AdSpaceEntityStatus),
      visibility: mapEnumValue(adSpaceDao.visibility, AdSpaceEntityVisibility),
    });
  }
}
