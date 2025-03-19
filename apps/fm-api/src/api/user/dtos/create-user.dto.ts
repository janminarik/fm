import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { UserPasswordOptions } from "../../../common/password.options";
import { UserDto } from "./user.dto";

export class CreateUserDto extends OmitType(UserDto, [
  "id",
  "role",
  "phoneNumber",
  "createdAt",
  "updatedAt",
  "lastLogin",
]) {
  @ApiProperty({ example: "P@ssword2025" })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(UserPasswordOptions)
  password: string;
}
