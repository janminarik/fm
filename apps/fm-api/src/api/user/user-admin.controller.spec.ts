import {
  test,
  jest,
  beforeEach,
  describe,
  expect,
  afterEach,
} from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserUseCase } from "@repo/fm-application";
import { createUserFake } from "@repo/fm-mock-data";
import { mock, MockProxy } from "jest-mock-extended";

import { UserMapper } from "./common/user.mapper";
import { CreateUserDto, UserDto } from "./dtos";
import { UserAdminController } from "./user-admin.controller";

describe("UserAdminController", () => {
  let controller: UserAdminController;
  let mockCreateUserUseCase: MockProxy<CreateUserUseCase>;
  let mockUserMapper: MockProxy<UserMapper>;

  beforeEach(async () => {
    mockCreateUserUseCase = mock<CreateUserUseCase>();
    mockUserMapper = mock<UserMapper>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAdminController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UserMapper,
          useValue: mockUserMapper,
        },
      ],
    }).compile();

    controller = module.get<UserAdminController>(UserAdminController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("should create a user and return the mapped user DTO", async () => {
      const userData = createUserFake();

      const mockEntity = userData;
      const mockPaylod: CreateUserDto = { ...mockEntity } as CreateUserDto;

      mockCreateUserUseCase.execute.mockResolvedValue(mockEntity);
      mockUserMapper.to.mockReturnValue(mockEntity);

      const controllerSpy = jest.spyOn(controller, "createUser");

      const result = await controller.createUser(mockPaylod);

      expect(controllerSpy).toHaveBeenCalledWith(mockPaylod);
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(mockPaylod);
      expect(mockUserMapper.to).toHaveBeenCalledWith(UserDto, mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });
});
