import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@repo/fm-domain";
import { Expose } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { BaseEntityDto } from "../../../common/dto";

export class UserDto extends BaseEntityDto {
  @ApiProperty({ example: "john.doe@exaple.com" })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ required: true, example: "John" })
  @IsNotEmpty()
  @Expose()
  firstName: string;

  @ApiProperty({ required: true, example: "Doe" })
  @IsNotEmpty()
  @Expose()
  lastName: string;

  @ApiPropertyOptional({ example: "john_doe" })
  @IsOptional()
  @IsString()
  @Expose()
  userName: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @Expose()
  role: Role[];

  @ApiPropertyOptional()
  @IsPhoneNumber()
  @Expose()
  phoneNumber: string;

  @ApiPropertyOptional()
  @Expose()
  lastLogin: Date | null;
}
