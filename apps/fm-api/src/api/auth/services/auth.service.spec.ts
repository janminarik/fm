import {
  jest,
  describe,
  expect,
  beforeEach,
  test,
  afterEach,
} from "@jest/globals";
import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  ACCESS_TOKEN_SERVICE,
  type IAccessTokenService,
  type IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from "@repo/fm-auth";
import { AuthToken } from "@repo/fm-auth";
import { type IUserRepository, User, USER_REPOSITORY } from "@repo/fm-domain";
import { createUserFake } from "@repo/fm-mock-data";
import { HASH_SERVICE, type IHashService } from "@repo/fm-shared";
import { mock, MockProxy } from "jest-mock-extended";
import { ClsModule } from "nestjs-cls";

import { AuthService } from "../services/auth.service";

jest.mock("@nestjs-cls/transactional", () => ({
  Transactional:
    () => (_: unknown, __: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: MockProxy<IUserRepository>;
  let mockHashService: MockProxy<IHashService>;
  let mockAccessTokenService: MockProxy<IAccessTokenService>;
  let mockRefreshTokenService: MockProxy<IRefreshTokenService>;

  beforeEach(async () => {
    mockUserRepository = mock<IUserRepository>();
    mockHashService = mock<IHashService>();
    mockAccessTokenService = mock<IAccessTokenService>();
    mockRefreshTokenService = mock<IRefreshTokenService>();

    const moduleFixture = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: { mount: false },
        }),
      ],
      providers: [
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: HASH_SERVICE,
          useValue: mockHashService,
        },
        {
          provide: ACCESS_TOKEN_SERVICE,
          useValue: mockAccessTokenService,
        },
        {
          provide: REFRESH_TOKEN_SERVICE,
          useValue: mockRefreshTokenService,
        },
        AuthService,
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should init", () => {
    expect(authService).toBeDefined();
  });

  describe("login", () => {
    test("should login", async () => {
      const mockUser: User = createUserFake();
      const email = mockUser.email;
      const password = "password-hash";

      const mockAccessToken: AuthToken = {
        token: "token-value",
        expiresAt: 123,
      };

      const mockRefreshToken: AuthToken = {
        token: "token-value",
        expiresAt: 123,
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockAccessTokenService.createToken.mockResolvedValue(mockAccessToken);
      mockRefreshTokenService.createToken.mockResolvedValue(mockRefreshToken);
      mockHashService.compare.mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockHashService.compare).toHaveBeenCalled();
      expect(mockAccessTokenService.createToken).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith(
        mockUser.id,
      );

      expect(result).toEqual({
        accessToken: mockAccessToken.token,
        accessTokenExpiresAt: mockAccessToken.expiresAt,
        refreshToken: mockRefreshToken.token,
        refreshTokenExpiresAt: mockRefreshToken.expiresAt,
      });
    });

    test("login should fail when user does not exist", async () => {
      const mockUser: User = createUserFake();
      const email = mockUser.email;
      const password = "password-hash";
      const expectedError = new UnauthorizedException("Invalid credentials");

      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        expectedError,
      );
    });

    test("login should fail when user is not verified", async () => {
      const mockUser: User = createUserFake();
      const email = mockUser.email;
      const password = "password-hash";
      const expectedError = new UnauthorizedException("Invalid credentials");

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      mockHashService.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe("verifyUserPassword", () => {
    test("should verify user if passwordHash is equal", async () => {
      const password = "password";
      const passwordHash = "password-hash";

      mockHashService.compare.mockResolvedValue(true);

      const result = await authService.verifyUserPassword(
        password,
        passwordHash,
      );

      expect(result).toBe(true);
    });
  });
});
