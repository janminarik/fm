import { test, jest, beforeAll, describe, expect } from "@jest/globals";
import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
  ACCESS_TOKEN_SERVICE,
  AuthCookieService,
  IAccessTokenService,
  IRefreshTokenService,
  IRenewTokenService,
  REFRESH_TOKEN_SERVICE,
  RENEW_TOKEN_SERVICE,
} from "@repo/fm-auth";
import { plainToInstance } from "class-transformer";

import { AuthController } from "./auth.controller";
import { LoginRequestDto } from "./dto";
import { AuthTokenPairDto } from "./dto/auth-token-pair.dto";
import { AuthService } from "./services/auth.service";
import { validateDto } from "../../utils/test/test-utils";

describe("AuthController", () => {
  type LoginFunction = (
    email: string,
    password: string,
  ) => Promise<AuthTokenPairDto>;

  let controller: AuthController;
  let tokenServiceMock: jest.Mocked<Partial<IAccessTokenService>>;
  let refreshTokenServiceMock: jest.Mocked<Partial<IRefreshTokenService>>;
  let renewTokenServiceMock: jest.Mocked<Partial<IRenewTokenService>>;
  let cookieServiceMock: jest.Mocked<Partial<AuthCookieService>>;
  let authServiceMock: {
    login: jest.Mock<LoginFunction>;
  };

  beforeAll(async () => {
    authServiceMock = {
      login: jest.fn<LoginFunction>(),
    };
    tokenServiceMock = {};
    refreshTokenServiceMock = {};
    renewTokenServiceMock = {};
    cookieServiceMock = {
      setCookie: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: ACCESS_TOKEN_SERVICE,
          useValue: tokenServiceMock,
        },
        {
          provide: REFRESH_TOKEN_SERVICE,
          useValue: refreshTokenServiceMock,
        },
        {
          provide: RENEW_TOKEN_SERVICE,
          useValue: renewTokenServiceMock,
        },
        {
          provide: AuthCookieService,
          useValue: cookieServiceMock,
        },
      ],
    }).compile();

    controller = moduleFixture.get<AuthController>(AuthController);
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

      authServiceMock.login?.mockResolvedValueOnce(loginResDto);

      const result = await controller.login(loginReqDto);

      expect(result).toBe(loginResDto);
      expect(authServiceMock.login).toHaveBeenNthCalledWith(
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

      authServiceMock.login?.mockRejectedValueOnce(
        new UnauthorizedException("Invalid credentials"),
      );

      await expect(controller.login(loginReqDto)).rejects.toThrow(
        "Invalid credentials",
      );
      expect(authServiceMock.login).toHaveBeenNthCalledWith(
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
});
