import { JwtAccessPayloadDto } from "./jwt-access-payload.dto";

export class JwtRefreshPayloadDto extends JwtAccessPayloadDto {
  token: string;
}
