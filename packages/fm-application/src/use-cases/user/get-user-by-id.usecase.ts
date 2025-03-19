import { Inject } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { IUserRepository, User, USER_REPOSITORY } from "@repo/fm-domain";

import { IBaseUseCase } from "../../common";

export class GetUserByIdUseCase implements IBaseUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  @Transactional()
  async execute(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
