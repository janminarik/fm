import { Inject } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { IUserRepository, User, USER_REPOSITORY } from "@repo/fm-domain";

import { IBaseUseCase } from "../../common";

export class GetUserByEmailUseCase implements IBaseUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  @Transactional()
  async execute(email: string): Promise<User> {
    return await this.userRepository.findUserByEmail(email);
  }
}
