import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { User as UserEntity } from "@repo/fm-domain";
import { BaseMapper } from "@repo/fm-shared";

@Injectable()
export class UserMapper extends BaseMapper {
  toDomain(userDao: User): UserEntity | null {
    if (!userDao) return null;

    return new UserEntity({
      ...userDao,
      userName: userDao.userName ?? undefined,
      phoneNumber: userDao.phoneNumber ?? undefined,
      lastLogin: userDao.lastLogin ?? undefined,
      deletedAt: userDao.deletedAt ?? undefined,
      createdAt: userDao.createdAt ?? undefined,
      updatedAt: userDao.updatedAt ?? undefined,
    });
  }
}
