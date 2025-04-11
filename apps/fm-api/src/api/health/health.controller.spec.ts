import {
  afterEach,
  jest,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "@repo/fm-db";
import { mock, MockProxy } from "jest-mock-extended";

import { HealthController } from "../health/health.controller";

describe("HealthController", () => {
  let controller: HealthController;
  let healthCheckServiceMock: MockProxy<HealthCheckService>;
  let prismaHealthIndicatorMock: MockProxy<PrismaHealthIndicator>;
  let prismaServiceMock: MockProxy<PrismaService>;

  beforeEach(async () => {
    healthCheckServiceMock = mock<HealthCheckService>();
    prismaHealthIndicatorMock = mock<PrismaHealthIndicator>();
    prismaServiceMock = mock<PrismaService>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: healthCheckServiceMock,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: prismaHealthIndicatorMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    controller = moduleFixture.get(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should init", () => {
    expect(controller).toBeDefined();
    expect(healthCheckServiceMock).toBeDefined();
    expect(prismaHealthIndicatorMock).toBeDefined();
    expect(prismaServiceMock).toBeDefined();
  });

  test("should check OK", async () => {
    const prismaHealthResultMock: HealthIndicatorResult = {
      database: {
        status: "up",
      },
    };

    const healthCheckResultMock: HealthCheckResult = {
      status: "ok",
      info: {
        database: {
          status: "up",
        },
      },
      error: {},
      details: {
        database: {
          status: "up",
        },
      },
    };

    prismaHealthIndicatorMock.pingCheck.mockResolvedValue(
      prismaHealthResultMock,
    );
    healthCheckServiceMock.check.mockResolvedValue(healthCheckResultMock);

    const result = await controller.check();

    expect(result).toBeDefined();
    expect(result.status).toBe("ok");
  });
});
