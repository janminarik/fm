// import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { isUUID } from "class-validator";
// import { JwtAccessPayloadDto } from "../dto";

export class JwtAccessGuard extends AuthGuard("jwtAccess") {
  // handleRequest<T = JwtAccessPayloadDto>(err: Error, user: T, info: Error): T {
  //   if (err || !user) {
  //     throw new UnauthorizedException({
  //       message: "The access token is unauthorized", //TODO: loc a custom HTTP STATUS ?
  //       _error: err ? err.message : info.message,
  //     });
  //   }
  //   const { sub } = user as JwtAccessPayloadDto;
  //   if (!sub) {
  //     throw new UnauthorizedException({
  //       message: "The access token is unauthorized", //TODO: loc a custom HTTP STATUS ?
  //     });
  //   } else if (!isUUID(sub)) {
  //     throw new UnauthorizedException({
  //       message: "The access token is unauthorized", //TODO: loc a custom HTTP STATUS ?
  //     });
  //   }
  //   return user;
  // }
}
