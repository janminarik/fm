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
  let mockHealthCheckService: MockProxy<HealthCheckService>;
  let mockPrismaHealthIndicator: MockProxy<PrismaHealthIndicator>;
  let mockPrismaService: MockProxy<PrismaService>;

  beforeEach(async () => {
    mockHealthCheckService = mock<HealthCheckService>();
    mockPrismaHealthIndicator = mock<PrismaHealthIndicator>();
    mockPrismaService = mock<PrismaService>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: mockPrismaHealthIndicator,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
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
    expect(mockHealthCheckService).toBeDefined();
    expect(mockPrismaHealthIndicator).toBeDefined();
    expect(mockPrismaService).toBeDefined();
  });

  test("should check OK", async () => {
    const mockPrismaHealthResult: HealthIndicatorResult = {
      database: {
        status: "up",
      },
    };

    const mockHealthCheckResult: HealthCheckResult = {
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

    mockPrismaHealthIndicator.pingCheck.mockResolvedValue(
      mockPrismaHealthResult,
    );
    mockHealthCheckService.check.mockResolvedValue(mockHealthCheckResult);

    const result = await controller.check();

    expect(result).toBeDefined();
    expect(result.status).toBe("ok");
  });
});
