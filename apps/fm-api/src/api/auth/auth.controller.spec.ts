import {
  test,
  jest,
  beforeAll,
  describe,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
  ACCESS_TOKEN_SERVICE,
  AuthCookieService,
  AuthTokenPair,
  IAccessTokenService,
  IRefreshTokenService,
  IRenewTokenService,
  JwtRefreshPayloadDto,
  REFRESH_TOKEN_SERVICE,
  RENEW_TOKEN_SERVICE,
} from "@repo/fm-auth";
import { plainToInstance } from "class-transformer";
import { mock, MockProxy } from "jest-mock-extended";

import { AuthController } from "./auth.controller";
import { LoginRequestDto } from "./dto";
import { AuthTokenPairDto } from "./dto/auth-token-pair.dto";
import { AuthService } from "./services/auth.service";
import { validateDto } from "../../utils/test/test-utils";

describe("AuthController", () => {
  let controller: AuthController;
  let mockTokenService: MockProxy<IAccessTokenService>;
  let mockRefreshTokenService: MockProxy<IRefreshTokenService>;
  let mockRenewTokenService: MockProxy<IRenewTokenService>;
  let mockCookieService: MockProxy<AuthCookieService>;
  let mockAuthService: MockProxy<AuthService>;

  beforeEach(async () => {
    mockAuthService = mock<AuthService>();
    mockTokenService = mock<IAccessTokenService>();
    mockRefreshTokenService = mock<IRefreshTokenService>();
    mockRenewTokenService = mock<IRenewTokenService>();
    mockCookieService = mock<AuthCookieService>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ACCESS_TOKEN_SERVICE,
          useValue: mockTokenService,
        },
        {
          provide: REFRESH_TOKEN_SERVICE,
          useValue: mockRefreshTokenService,
        },
        {
          provide: RENEW_TOKEN_SERVICE,
          useValue: mockRenewTokenService,
        },
        {
          provide: AuthCookieService,
          useValue: mockCookieService,
        },
      ],
    }).compile();

    controller = moduleFixture.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should init controller", () => {
    expect(controller).toBeDefined();
  });

  describe("login", () => {
    test("should return JWT tokens", async () => {
      const loginReqDto: LoginRequestDto = {
        email: "john.doe@example.com",
        password: "P@ssw0rd2025",
      };

      const loginResDto: AuthTokenPairDto = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        accessTokenExpiresAt: Math.floor(Date.now() / 1000),
        refreshTokenExpiresAt: Math.floor(Date.now() / 1000),
      };

      mockAuthService.login?.mockResolvedValueOnce(loginResDto);

      const result = await controller.login(loginReqDto);

      expect(result).toBe(loginResDto);
      expect(mockAuthService.login).toHaveBeenNthCalledWith(
        1,
        loginReqDto.email,
        loginReqDto.password,
      );
    });

    test("should throw and error if login fails", async () => {
      const loginReqDto: LoginRequestDto = {
        email: "john.doe@example.com",
        password: "P@ssw0rd2025",
      };

      mockAuthService.login?.mockRejectedValueOnce(
        new UnauthorizedException("Invalid credentials"),
      );

      await expect(controller.login(loginReqDto)).rejects.toThrow(
        "Invalid credentials",
      );
      expect(mockAuthService.login).toHaveBeenNthCalledWith(
        1,
        loginReqDto.email,
        loginReqDto.password,
      );
    });

    describe("LoginRequestDto", () => {
      test("should validate successfully with valid data", async () => {
        const validData = {
          email: "john.doe@example.com",
          password: "P@ssw0rd2025",
        };

        const dto = plainToInstance(LoginRequestDto, validData);

        const validationErrors = await validateDto(dto);

        expect(validationErrors).toHaveLength(0);
      });

      test("should fail validation if email is not valid", async () => {
        const invalidData = {
          email: "johndoe@example",
          password: "P@ssw0rd",
        };

        const dto = plainToInstance(LoginRequestDto, invalidData);

        const validationErrors = await validateDto(dto);

        expect(validationErrors).toHaveLength(1);
        expect(validationErrors[0]?.property).toBe("email");
      });

      test("should fail validation if password is missing", async () => {
        const invaliData = {
          email: "john.doe@example.com",
        };

        const dto = plainToInstance(LoginRequestDto, invaliData);

        const validationErrors = await validateDto(dto);

        expect(validationErrors).toHaveLength(1);
        expect(validationErrors[0]?.property).toBe("password");
      });
      test("should fail validation if password is weak", async () => {
        const invaliData = {
          email: "john.doe@example.com",
          password: "Password123",
        };

        const dto = plainToInstance(LoginRequestDto, invaliData);

        const validationErrors = await validateDto(dto);

        expect(validationErrors).toHaveLength(1);
        expect(validationErrors[0]?.property).toBe("password");
        expect(validationErrors[0]?.constraints?.isStrongPassword).toBe(
          "password is not strong enough",
        );
      });
    });
  });

  describe("refresh token", () => {
    test("should refresh token", async () => {
      const mockJwtPayload: JwtRefreshPayloadDto = {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        jti: "550e8400-e29b-41d4-a716-446655440001",
        token: "token",
      };

      const mockTokenPair: AuthTokenPair = {
        accessToken: {
          token: "token",
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        },
        refreshToken: {
          token: "token",
          expiresAt: Math.floor(Date.now() / 1000) + 86400,
        },
      };

      mockRenewTokenService.generateAccessToken.mockResolvedValue(
        mockTokenPair,
      );

      const result = await controller.refreshAccessToken(mockJwtPayload);

      expect(
        mockRenewTokenService.generateAccessToken,
      ).toHaveBeenLastCalledWith(mockJwtPayload.userId, mockJwtPayload.token);
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.accessTokenExpiresAt).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.refreshTokenExpiresAt).toBeDefined();
    });
  });
});
