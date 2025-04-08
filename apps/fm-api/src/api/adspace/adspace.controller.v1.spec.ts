import { Test, TestingModule } from "@nestjs/testing";
import {
  CreateAdSpaceUseCase,
  DeleteAdSpaceUseCase,
  GetAdSpaceUseCase,
  ListAdSpaceUseCase,
  UpdateAdSpaceUseCase,
} from "@repo/fm-application";
import {
  AdSpace,
  IListPaginationParams,
  IListPaginationResult,
} from "@repo/fm-domain";
import {
  createAdSpaceFake,
  generateCreateAdSpacePayload,
  generateUpdatedSpacePayload,
} from "@repo/fm-mock-data";
import { IdParams } from "src/common/dto";
import { v4 as uuid4 } from "uuid";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import { AdSpaceDto } from "./dto";

describe("AdSpaceControllerV1", () => {
  let controller: AdSpaceControllerV1;
  let getAdSpaceUseCase: { execute: jest.Mock };
  let createAdSpaceUseCase: { execute: jest.Mock };
  let updateAdSpaceUseCase: { execute: jest.Mock };
  let deleteAdSpaceUseCase: { execute: jest.Mock };
  let listAdSpaceUseCase: { execute: jest.Mock };
  let mapper: { to: jest.Mock; toList: jest.Mock };

  beforeEach(async () => {
    const mockGetAdSpaceUseCase = {
      execute: jest.fn(),
    };

    const mockCreateAdSpaceUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateAdSpaceUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteAdSpaceUseCase = {
      execute: jest.fn(),
    };

    const mockListAdSpaceUseCase = {
      execute: jest.fn(),
    };

    const mockMapper = {
      to: jest.fn(),
      toList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdSpaceControllerV1],
      providers: [
        { provide: GetAdSpaceUseCase, useValue: mockGetAdSpaceUseCase },
        { provide: CreateAdSpaceUseCase, useValue: mockCreateAdSpaceUseCase },
        { provide: UpdateAdSpaceUseCase, useValue: mockUpdateAdSpaceUseCase },
        { provide: DeleteAdSpaceUseCase, useValue: mockDeleteAdSpaceUseCase },
        { provide: ListAdSpaceUseCase, useValue: mockListAdSpaceUseCase },
        { provide: AdSpaceMapper, useValue: mockMapper },
      ],
    }).compile();

    controller = module.get<AdSpaceControllerV1>(AdSpaceControllerV1);
    getAdSpaceUseCase = module.get(GetAdSpaceUseCase);
    createAdSpaceUseCase = module.get(CreateAdSpaceUseCase);
    updateAdSpaceUseCase = module.get(UpdateAdSpaceUseCase);
    deleteAdSpaceUseCase = module.get(DeleteAdSpaceUseCase);
    listAdSpaceUseCase = module.get(ListAdSpaceUseCase);
    mapper = module.get(AdSpaceMapper);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("listPagination", () => {
    it("should return a paginated list of AdSpaceDto", async () => {
      const mockParams: IListPaginationParams = {
        page: 1,
        limit: 10,
      };
      const mockEntities: AdSpace[] = [createAdSpaceFake()];
      const mockResponse: IListPaginationResult<AdSpace> = {
        data: mockEntities,
        meta: {
          count: 1,
          total: 1,
          page: 1,
          totalPage: 10,
        },
      };
      const mockDtos: AdSpaceDto[] = mockEntities.map(
        (adspace) => ({ ...adspace }) as AdSpaceDto,
      );

      const controllerSpy = jest.spyOn(controller, "listPagination");

      listAdSpaceUseCase.execute.mockResolvedValue(mockResponse);
      mapper.toList.mockReturnValue(mockDtos);

      const result = await controller.listPagination(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(listAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams);
      expect(mapper.toList).toHaveBeenCalledWith(AdSpaceDto, mockEntities);
      expect(result).toEqual({
        data: mockDtos,
        meta: {
          count: 1,
          total: 1,
          page: 1,
          totalPage: 10,
        },
      });
    });
  });

  describe("get", () => {
    it("should return AdSpaceDto", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const mockEntity: AdSpace = createAdSpaceFake();
      const mockResponse = { ...mockEntity } as AdSpaceDto;
      const controllerSpy = jest.spyOn(controller, "get");

      getAdSpaceUseCase.execute.mockResolvedValue(mockEntity);
      mapper.to.mockReturnValue(mockResponse);

      const result = await controller.get(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(getAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams.id);
      expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("create", () => {
    it("should create an AdSpace", async () => {
      const mockPayload = generateCreateAdSpacePayload();
      const mockEntity = createAdSpaceFake();
      const mockResponse = { ...mockEntity, id: uuid4() } as AdSpaceDto;

      const controllerSpy = jest.spyOn(controller, "create");

      createAdSpaceUseCase.execute.mockResolvedValue(mockEntity);
      mapper.to.mockReturnValue(mockResponse);

      const result = await controller.create(mockPayload);

      expect(controllerSpy).toHaveBeenCalledWith(mockPayload);
      expect(createAdSpaceUseCase.execute).toHaveBeenCalledWith(mockPayload);
      expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should update AdSpace", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const mockPayload = generateUpdatedSpacePayload();
      const mockEntity = { ...mockPayload, id: mockId };
      const mockResponse = { ...mockEntity } as AdSpaceDto;

      const controllerUpdateSpy = jest.spyOn(controller, "update");

      mapper.to.mockReturnValue(mockResponse);
      updateAdSpaceUseCase.execute.mockResolvedValue(mockEntity);

      const result = await controller.update(mockParams, mockPayload);

      expect(controllerUpdateSpy).toHaveBeenCalledWith(mockParams, mockPayload);
      expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(updateAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockId,
        mockPayload,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("should delete AdSpace", async () => {
      const mockId = uuid4();
      const mockParamas: IdParams = {
        id: mockId,
      };

      const mockEntity = createAdSpaceFake(mockId);

      const controllerSpy = jest.spyOn(controller, "delete");

      deleteAdSpaceUseCase.execute.mockResolvedValue(mockEntity);

      await controller.delete(mockParamas);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParamas);
      expect(deleteAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParamas.id);
    });
  });

  //   it("should return an AdSpaceDto by id", async () => {
  //     // Arrange
  //     const mockId = "1";
  //     const mockAdSpace = { id: mockId, name: "Test AdSpace" };
  //     const mockDto = { id: mockId, name: "Test AdSpace DTO" };

  //     getAdSpaceUseCase.execute.mockResolvedValue(mockAdSpace);
  //     mapper.to.mockReturnValue(mockDto);

  //     // Act
  //     const result = await controller.get({ id: mockId });

  //     // Assert
  //     expect(getAdSpaceUseCase.execute).toHaveBeenCalledWith(mockId);
  //     expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockAdSpace);
  //     expect(result).toEqual(mockDto);
  //   });
  // });

  // describe("create", () => {
  //   it("should create and return an AdSpaceDto", async () => {
  //     // Arrange
  //     const createDto: CreateAdSpaceDto = { name: "New AdSpace" };
  //     const mockCreatedAdSpace = { id: "1", ...createDto };
  //     const mockDto = { id: "1", name: "New AdSpace DTO" };

  //     createAdSpaceUseCase.execute.mockResolvedValue(mockCreatedAdSpace);
  //     mapper.to.mockReturnValue(mockDto);

  //     // Act
  //     const result = await controller.create(createDto);

  //     // Assert
  //     expect(createAdSpaceUseCase.execute).toHaveBeenCalledWith(createDto);
  //     expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockCreatedAdSpace);
  //     expect(result).toEqual(mockDto);
  //   });
  // });

  // describe("update", () => {
  //   it("should update and return an AdSpaceDto", async () => {
  //     // Arrange
  //     const mockId = "1";
  //     const updateDto: UpdateAdSpaceDto = { name: "Updated AdSpace" };
  //     const mockUpdatedAdSpace = { id: mockId, ...updateDto };
  //     const mockDto = { id: mockId, name: "Updated AdSpace DTO" };

  //     updateAdSpaceUseCase.execute.mockResolvedValue(mockUpdatedAdSpace);
  //     mapper.to.mockReturnValue(mockDto);

  //     // Act
  //     const result = await controller.update({ id: mockId }, updateDto);

  //     // Assert
  //     expect(updateAdSpaceUseCase.execute).toHaveBeenCalledWith(
  //       mockId,
  //       updateDto,
  //     );
  //     expect(mapper.to).toHaveBeenCalledWith(AdSpaceDto, mockUpdatedAdSpace);
  //     expect(result).toEqual(mockDto);
  //   });
  // });

  // describe("delete", () => {
  //   it("should call deleteAdSpaceUseCase with the correct id", async () => {
  //     // Arrange
  //     const mockId = "1";
  //     deleteAdSpaceUseCase.execute.mockResolvedValue(undefined);

  //     // Act
  //     await controller.delete({ id: mockId });

  //     // Assert
  //     expect(deleteAdSpaceUseCase.execute).toHaveBeenCalledWith(mockId);
  //   });
  // });
});
