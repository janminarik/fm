import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AUTH_CONFIG, JwtAuthConfig } from "../config";
import { JwtAccessPayloadDto } from "../dto";
import { AuthTokenExtractorService } from "../services";

export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwtAccess") {
  constructor(
    @Inject(AUTH_CONFIG) config: JwtAuthConfig,
    private jwtExtractorService: AuthTokenExtractorService,
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => jwtExtractorService.extractAccessToken(req),
      ]),

      ignoreExpiration: false,

      jsonWebTokenOptions: {
        ignoreNotBefore: true,
        audience: config.audience,
        issuer: config.issuer,
      },
      secretOrKey: config.accessTokenSecret,
    });
  }

  async validate(
    tokenPayload: JwtAccessPayloadDto,
  ): Promise<JwtAccessPayloadDto> {
    const user = await this.userRepository.findById(tokenPayload.sub);
    if (!user) throw new UnauthorizedException("User not found");
    return tokenPayload;
  }
}
