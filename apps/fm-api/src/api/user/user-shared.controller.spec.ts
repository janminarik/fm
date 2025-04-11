import {
  test,
  jest,
  afterEach,
  beforeEach,
  describe,
  expect,
} from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { GetUserByIdUseCase } from "@repo/fm-application";
import { JwtAccessPayloadDto } from "@repo/fm-auth";
import { User } from "@repo/fm-domain";
import { createUserFake } from "@repo/fm-mock-data";
import { mock, MockProxy } from "jest-mock-extended";
import { v4 as uuid4 } from "uuid";

import { UserMapper } from "./common/user.mapper";
import { UserDto } from "./dtos";
import { UserSharedController } from "./user-shared.controller";

describe("UserSharedController", () => {
  let controller: UserSharedController;
  let mockGetUserByIdUseCase: MockProxy<GetUserByIdUseCase>;
  let mockUserMapper: MockProxy<UserMapper>;

  beforeEach(async () => {
    mockGetUserByIdUseCase = mock<GetUserByIdUseCase>();
    mockUserMapper = mock<UserMapper>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSharedController],
      providers: [
        {
          provide: GetUserByIdUseCase,
          useValue: mockGetUserByIdUseCase,
        },
        {
          provide: UserMapper,
          useValue: mockUserMapper,
        },
      ],
    }).compile();

    controller = module.get<UserSharedController>(UserSharedController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    test("should get a user profile and return the mapped user DTO", async () => {
      const mockEntity: User = createUserFake();
      const userId = uuid4();
      const mockJwtPayload: JwtAccessPayloadDto = { userId, jti: uuid4() };

      mockGetUserByIdUseCase.execute.mockResolvedValue(mockEntity);
      mockUserMapper.to.mockReturnValue(mockEntity);

      const controllerSpy = jest.spyOn(controller, "getProfile");

      const result = await controller.getProfile(mockJwtPayload);

      expect(controllerSpy).toHaveBeenCalledWith(mockJwtPayload);
      expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
      expect(mockUserMapper.to).toHaveBeenCalledWith(UserDto, mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });
});
