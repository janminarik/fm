import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUserByIdUseCase } from "@repo/fm-application";
import { JwtAccessGuard, JwtAccessPayloadDto, JwtPayload } from "@repo/fm-auth";

import { UserMapper } from "./common/user.mapper";
import { GetUserProfileDoc } from "./docs/user.doc";
import { UserDto } from "./dtos";

@ApiTags("user")
@Controller({ version: "1", path: "user" })
export class UserSharedController {
  constructor(
    private readonly getUserById: GetUserByIdUseCase,
    private readonly mapper: UserMapper,
  ) {}

  @GetUserProfileDoc()
  @UseGuards(JwtAccessGuard)
  @Get("/profile")
  async getProfile(@JwtPayload() data: JwtAccessPayloadDto): Promise<UserDto> {
    const user = await this.getUserById.execute(data.userId);
    return this.mapper.to(UserDto, user);
  }
}
