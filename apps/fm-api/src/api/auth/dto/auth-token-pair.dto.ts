import { ApiProperty } from "@nestjs/swagger";

//TODO: odstranit DTO
export class AuthTokenPairDto {
  @ApiProperty({
    description: "JWT access token used for authenticating API requests.",
  })
  accessToken: string;
  @ApiProperty({
    description:
      "Expiration time of the access token as a Unix timestamp (in seconds).",
    example: 1741591067,
  })
  accessTokenExpiresAt: number;

  @ApiProperty({
    description:
      "JWT refresh token used to obtain a new access token when the current one expires.",
  })
  refreshToken: string;
  @ApiProperty()
  @ApiProperty({
    description:
      "Expiration time of the refresh token as a Unix timestamp (in seconds).",
    example: 1744183067,
  })
  refreshTokenExpiresAt: number;
}
