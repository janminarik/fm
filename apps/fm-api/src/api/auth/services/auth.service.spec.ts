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
import { mock } from "jest-mock-extended";
import { AuthToken } from "@repo/fm-auth";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { ClsModule } from "nestjs-cls";
import { createUserFake } from "@repo/fm-mock-data";

export class Ahoj {
  pozdrav: string;
}

const mockTransactionalAdapter = {
  connection: undefined, // Nepotrebné pre unit testy
  options: {},
  getTransactionHost: () => ({
    withTransaction: async (fn: () => Promise<any>) => await fn(),
    tx: undefined,
  }),
};

describe("AuthService", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let hashServiceMock: jest.Mocked<IHashService>;
  let accessTokenServiceMock: jest.Mocked<IAccessTokenService>;
  let refreshTokenServiceMock: jest.Mocked<IRefreshTokenService>;

  beforeEach(() => {
    //TODO:
    // mockReset()
  });

  beforeAll(async () => {
    // userRepositoryMock = mock<IUserRepository>();
    // hashServiceMock = mock<IHashService>();
    // accessTokenServiceMock = mock<IAccessTokenService>();
    // refreshTokenServiceMock = mock<IRefreshTokenService>();

    userRepositoryMock = {
      findUserByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    hashServiceMock = {
      getSalt: jest.fn(),
      hash: jest.fn(),
      compare: jest.fn(),
    };
    accessTokenServiceMock = {
      createToken: jest.fn(),
    };
    refreshTokenServiceMock = {
      createToken: jest.fn(),
      validateToken: jest.fn(),
      revokeToken: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      // imports: [
      //   ClsModule.forRoot({
      //     global: true,
      //     middleware: { mount: false },
      //     plugins: [
      //       new ClsPluginTransactional({
      //         adapter: mockTransactionalAdapter as any,
      //         connectionName: "default",
      //       }),
      //     ],
      //   }),
      // ],
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
  });
});
