import { IRequest, IUser } from "@repo/nest-common";

import { JwtAccessPayloadDto } from "../dto";

export interface IUserRequest<TUser extends IUser = JwtAccessPayloadDto>
  extends IRequest {
  user?: TUser;
}
