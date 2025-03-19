import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ErrorDto } from "../dto";
import { GetDefaultDescription } from "./response-doc.decorator";

export interface IDocAuthOptions {
  jwtAccessToken?: boolean;
  jwtAccessTokenName?: string;
  jwtRefreshToken?: boolean;
  jwtRefreshTokenName?: string;
  xApiKey?: boolean;
}

export function DocAuth<TError>(
  options?: IDocAuthOptions,
  errorDto?: new () => TError,
): MethodDecorator {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options.jwtAccessToken) {
    docs.push(ApiBearerAuth(options.jwtAccessTokenName));
    docs.push(
      ApiUnauthorizedResponse({
        description: GetDefaultDescription(401),
        type: errorDto ?? ErrorDto,
      }),
    );
  }

  if (options.jwtRefreshToken) {
    docs.push(ApiBearerAuth(options.jwtRefreshTokenName));
    ApiUnauthorizedResponse({
      description: GetDefaultDescription(401),
      type: errorDto ?? ErrorDto,
    });
  }

  return applyDecorators(...docs);
}
