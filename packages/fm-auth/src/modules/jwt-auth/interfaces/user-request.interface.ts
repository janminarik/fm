import { IRequest } from "@repo/nest-common";

import { JwtAccessPayloadDto } from "../dto";

export interface IUserRequest<TUser = JwtAccessPayloadDto> extends IRequest {
  user?: TUser;
}
