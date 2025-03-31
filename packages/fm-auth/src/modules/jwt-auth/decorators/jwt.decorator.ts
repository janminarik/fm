import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { JwtAccessPayloadDto } from "../dto";
import { IUserRequest } from "../interfaces";

export const JwtPayload = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtAccessPayloadDto => {
    const req = context.switchToHttp().getRequest<IUserRequest>();
    if (!req.user) {
      throw new Error("User payload is missing in the request.");
    }
    return req.user;
  },
);
