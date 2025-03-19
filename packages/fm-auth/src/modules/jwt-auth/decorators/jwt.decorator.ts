import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { JwtAccessPayloadDto } from "../dto";
import { IUserRequest } from "../interfaces";

export const JwtPayload = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtAccessPayloadDto => {
    const req = context.switchToHttp().getRequest<IUserRequest>();
    return req.user;
  },
);
