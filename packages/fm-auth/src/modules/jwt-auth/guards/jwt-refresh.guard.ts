import { AuthGuard } from "@nestjs/passport";

//TODO: Custom error rovnako ako pri jwt-acesss.guard
export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {}
