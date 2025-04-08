import { Test, TestingModule } from "@nestjs/testing";
import { GetUserByIdUseCase } from "@repo/fm-application";
import { JwtAccessPayloadDto } from "@repo/fm-auth";
import { createUserFake } from "@repo/fm-mock-data";
import { v4 as uuid4 } from "uuid";

import { UserMapper } from "./common/user.mapper";
import { UserDto } from "./dtos";
import { UserSharedController } from "./user-shared.controller";

describe("UserSharedController", () => {
  let controller: UserSharedController;
  let getUserByIdUseCase: { execute: jest.Mock };
  let userMapper: { to: jest.Mock };

  beforeEach(async () => {
    const mockGetUserByIdUseCase = {
      execute: jest.fn(),
    };

    const mockUserMapper = {
      to: jest.fn(),
    };

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
    getUserByIdUseCase = module.get(GetUserByIdUseCase);
    userMapper = module.get(UserMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should get a user profile and return the mapped user DTO", async () => {
      const mockEntity = createUserFake();
      const userId = uuid4();
      const mockJwtPayload: JwtAccessPayloadDto = { userId, jti: uuid4() };

      getUserByIdUseCase.execute.mockResolvedValue(mockEntity);
      userMapper.to.mockReturnValue(mockEntity);

      const controllerSpy = jest.spyOn(controller, "getProfile");

      const result = await controller.getProfile(mockJwtPayload);

      expect(controllerSpy).toHaveBeenCalledWith(mockJwtPayload);
      expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
      expect(userMapper.to).toHaveBeenCalledWith(UserDto, mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });
});
