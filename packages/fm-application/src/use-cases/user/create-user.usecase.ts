import { Inject } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { type IUserRepository, User, USER_REPOSITORY } from "@repo/fm-domain";
import { HASH_SERVICE, type IHashService } from "@repo/fm-shared";

import { IBaseUseCase } from "../../common";

export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
};

export class CreateUserUseCase implements IBaseUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
  ) {}

  @Transactional()
  async execute(createUserPayload: CreateUserPayload): Promise<User> {
    const passwordHash = await this.hashService.hash(
      createUserPayload.password,
    );

    return await this.userRepository.create({
      email: createUserPayload.email,
      firstName: createUserPayload.firstName,
      lastName: createUserPayload.lastName,
      userName: createUserPayload.userName,
      passwordHash: passwordHash,
    });
  }
}
