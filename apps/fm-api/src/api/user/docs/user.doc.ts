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

import { UserDto } from "../dtos";

const docAuth = DocAuth({
  jwtAccessToken: true,
  jwtAccessTokenName: "Authorization",
});

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

export function CreateUserDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({ summary: "Create a user" }),
    DocRequest({}),
    DocResponse({
      description: "Create a new user",
      type: UserDto,
    }),
    DocErrors([...commonErrors]),
  );
}

export function GetUserProfileDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Get user profile",
    }),
    DocRequest({}),
    DocResponse({
      description: "User profile",
      type: UserDto,
    }),
    docAuth,
    DocErrors([...commonErrors]),
  );
}
