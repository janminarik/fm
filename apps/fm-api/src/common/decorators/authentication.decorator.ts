import { UseGuards } from "@nestjs/common";
import { JwtAccessGuard } from "@repo/fm-auth";

export default function Authentication(): MethodDecorator & ClassDecorator {
  return UseGuards(JwtAccessGuard);
}
