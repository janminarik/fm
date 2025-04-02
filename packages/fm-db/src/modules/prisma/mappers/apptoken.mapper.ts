import { Injectable } from "@nestjs/common";
import { AppToken } from "@prisma/client";
import {
  AppToken as AppTokenEntity,
  AppTokenType as AppTokenEntityType,
} from "@repo/fm-domain";
import { BaseMapper, mapEnumValue } from "@repo/fm-shared";

@Injectable()
export class AppTokenMapper extends BaseMapper {
  toDomain(appTokenDao: AppToken): AppTokenEntity | null {
    if (!appTokenDao) return null;
    return new AppTokenEntity({
      ...appTokenDao,
      value: appTokenDao.value ?? undefined,
      expiresAt: appTokenDao.expiresAt ?? undefined,
      revokedAt: appTokenDao.revokedAt ?? undefined,
      type: mapEnumValue(appTokenDao.type, AppTokenEntityType),
    });
  }
}
