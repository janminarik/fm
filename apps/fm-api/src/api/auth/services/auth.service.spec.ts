import {
  jest,
  beforeAll,
  describe,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import { type IUserRepository, User, USER_REPOSITORY } from "@repo/fm-domain";
import { HASH_SERVICE, type IHashService } from "@repo/fm-shared";
import {
  ACCESS_TOKEN_SERVICE,
  type IAccessTokenService,
  type IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from "@repo/fm-auth";
import { AuthService } from "../services/auth.service";
import { Test } from "@nestjs/testing";
import { AuthToken } from "@repo/fm-auth";
import { ClsModule } from "nestjs-cls";
import { createUserFake } from "@repo/fm-mock-data";
import { mock } from "jest-mock-extended";
import { UnauthorizedException } from "@nestjs/common";

jest.mock("@nestjs-cls/transactional", () => ({
  Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) =>
    descriptor,
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let hashServiceMock: jest.Mocked<IHashService>;
  let accessTokenServiceMock: jest.Mocked<IAccessTokenService>;
  let refreshTokenServiceMock: jest.Mocked<IRefreshTokenService>;

  beforeAll(async () => {
    userRepositoryMock = mock<IUserRepository>();
    hashServiceMock = mock<IHashService>();
    accessTokenServiceMock = mock<IAccessTokenService>();
    refreshTokenServiceMock = mock<IRefreshTokenService>();

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
          useValue: userRepositoryMock,
        },
        {
          provide: HASH_SERVICE,
          useValue: hashServiceMock,
        },
        {
          provide: ACCESS_TOKEN_SERVICE,
          useValue: accessTokenServiceMock,
        },
        {
          provide: REFRESH_TOKEN_SERVICE,
          useValue: refreshTokenServiceMock,
        },
        AuthService,
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should init", async () => {
    expect(authService).toBeDefined();
  });

  describe("login", () => {
    it("should login", async () => {
      const userMock: User = createUserFake();
      const email = userMock.email;
      const password = "password-hash";

      const accessTokenMock: AuthToken = {
        token: "token-value",
        expiresAt: 123,
      };

      const refreshTokenMock: AuthToken = {
        token: "token-value",
        expiresAt: 123,
      };

      userRepositoryMock.findUserByEmail.mockResolvedValue(userMock);
      accessTokenServiceMock.createToken.mockResolvedValue(accessTokenMock);
      refreshTokenServiceMock.createToken.mockResolvedValue(refreshTokenMock);

      const authServiceSpy = jest.spyOn(authService, "verifyUserPassword");
      authServiceSpy.mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith(email);
      expect(accessTokenServiceMock.createToken).toHaveBeenCalledWith(
        userMock.id,
      );
      expect(refreshTokenServiceMock.createToken).toHaveBeenCalledWith(
        userMock.id,
      );
      expect(result).toEqual({
        accessToken: accessTokenMock.token,
        accessTokenExpiresAt: accessTokenMock.expiresAt,
        refreshToken: refreshTokenMock.token,
        refreshTokenExpiresAt: refreshTokenMock.expiresAt,
      });
    });

    it("login should fail when user does not exists", async () => {
      const userMock: User = createUserFake();
      const email = userMock.email;
      const password = "password-hash";
      const expectedError = new UnauthorizedException("Invalid credentials");

      userRepositoryMock.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        expectedError,
      );
    });

    it("login should when user is not verified", async () => {
      const userMock: User = createUserFake();
      const email = userMock.email;
      const password = "password-hash";
      const expectedError = new UnauthorizedException("Invalid credentials");

      userRepositoryMock.findUserByEmail.mockResolvedValue(userMock);

      const authServiceSpy = jest.spyOn(authService, "verifyUserPassword");
      authServiceSpy.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe("verifyUserPassword", () => {
    it("should verified user if passwordHash is equal", async () => {
      const password = "password";
      const passwordHash = "password-hash";

      hashServiceMock.compare.mockResolvedValue(true);

      const result = await authService.verifyUserPassword(
        password,
        passwordHash,
      );

      expect(result).toBe(true);
    });
  });
});
