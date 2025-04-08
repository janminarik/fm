import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserUseCase } from "@repo/fm-application";
import { createUserFake } from "@repo/fm-mock-data";

import { UserMapper } from "./common/user.mapper";
import { CreateUserDto, UserDto } from "./dtos";
import { UserAdminController } from "./user-admin.controller";

describe("UserAdminController", () => {
  let controller: UserAdminController;
  let createUserUseCase: { execute: jest.Mock };
  let userMapper: { to: jest.Mock };

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };

    const mockUserMapper = {
      to: jest.fn(),
    };

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
    createUserUseCase = module.get(CreateUserUseCase);
    userMapper = module.get(UserMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and return the mapped user DTO", async () => {
      const userData = createUserFake();

      const mockEntity = userData;
      const mockPaylod: CreateUserDto = { ...mockEntity } as CreateUserDto;

      createUserUseCase.execute.mockResolvedValue(mockEntity);
      userMapper.to.mockReturnValue(mockEntity);

      const controllerSpy = jest.spyOn(controller, "createUser");

      const result = await controller.createUser(mockPaylod);

      expect(controllerSpy).toHaveBeenCalledWith(mockPaylod);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(mockPaylod);
      expect(userMapper.to).toHaveBeenCalledWith(UserDto, mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });
});
