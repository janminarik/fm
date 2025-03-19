import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserUseCase } from "@repo/fm-application";

import { UserMapper } from "./common/user.mapper";
import { CreateUserDoc } from "./docs/user.doc";
import { CreateUserDto, UserDto } from "./dtos";

@ApiTags("user")
@Controller({ version: "1", path: "user" })
export class UserAdminController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly mapper: UserMapper,
  ) {}

  @CreateUserDoc()
  @Post("/create")
  async createUser(@Body() useDto: CreateUserDto): Promise<UserDto> {
    const user = await this.createUserUseCase.execute({ ...useDto });
    return this.mapper.to(UserDto, user);
  }
}
