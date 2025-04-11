import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  DocAuth,
  DocError,
  DocErrors,
  DocOperation,
  DocRequest,
  DocResponse,
  ValidationErrorDto,
} from "@repo/nest-common";

import { LoginRequestDto } from "../dto";
import { AuthTokenPairDto } from "../dto/auth-token-pair.dto";

const commonErrors = [
  DocError(
    {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    },
    ValidationErrorDto,
  ),
  DocError({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
];

export function AuthLoginDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Login with email and password" }),
    DocRequest({ dto: LoginRequestDto }),
    DocResponse({ dto: AuthTokenPairDto, status: HttpStatus.OK }),
    DocErrors([
      ...commonErrors,
      DocError({ status: HttpStatus.UNAUTHORIZED }),
      DocError({ status: HttpStatus.TOO_MANY_REQUESTS }),
    ]),
  );
}

export function AuthLogoutDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Log out" }),
    DocAuth({ jwtAccessToken: true }),
    DocErrors([...commonErrors]),
  );
}

export function AuthRefreshTokenDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Refresh token" }),
    DocResponse({ dto: AuthTokenPairDto, status: HttpStatus.OK }),
    DocAuth({ jwtRefreshToken: true }),
    DocErrors([...commonErrors]),
  );
}

export function AuthRotateRefreshTokenDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Refresh token with rotation" }),
    DocResponse({ dto: AuthTokenPairDto, status: HttpStatus.OK }),
    DocAuth({ jwtRefreshToken: true }),
    DocErrors([...commonErrors]),
  );
}

export function AuthCheckAuthDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Check auth", deprecated: true }),
    DocAuth({ jwtAccessToken: true }),
    DocErrors([...commonErrors]),
  );
}
