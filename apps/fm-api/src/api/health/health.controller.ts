import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Version,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "@repo/fm-db";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  /*
  
  Docker

      healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3

  */
  @Version(VERSION_NEUTRAL)
  @Get()
  @ApiOperation({
    summary: "This method is to check health of the application",
  })
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.prismaHealthIndicator.pingCheck("database", this.prismaService, {
          timeout: 3000,
        }),
    ]);
  }
}
