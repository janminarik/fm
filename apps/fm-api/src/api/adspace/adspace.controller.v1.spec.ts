import { jest, beforeEach, describe, expect, it } from "@jest/globals";
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
import { v4 as uuid4 } from "uuid";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import { AdSpaceDto } from "./dto";
import { IdParams } from "../../common/dto/id.params";

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
    it("should return a paginated list of AdSpaceDto with proper metadata", async () => {
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

    it("should return an empty list when no ad spaces exist", async () => {
      const mockParams: IListPaginationParams = {
        page: 1,
        limit: 10,
      };
      const mockResponse: IListPaginationResult<AdSpace> = {
        data: [],
        meta: {
          count: 0,
          total: 0,
          page: 1,
          totalPage: 0,
        },
      };

      listAdSpaceUseCase.execute.mockResolvedValue(mockResponse);
      mapper.toList.mockReturnValue([]);

      const result = await controller.listPagination(mockParams);

      expect(listAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams);
      expect(mapper.toList).toHaveBeenCalledWith(AdSpaceDto, []);
      expect(result).toEqual({
        data: [],
        meta: {
          count: 0,
          total: 0,
          page: 1,
          totalPage: 0,
        },
      });
    });
  });

  describe("get", () => {
    it("should return an AdSpaceDto when provided with a valid ID", async () => {
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

    it("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      getAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.get(mockParams)).rejects.toThrow(error);
      expect(getAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams.id);
    });
  });

  describe("create", () => {
    it("should create and return an AdSpaceDto when given valid payload", async () => {
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
    it("should update and return AdSpaceDto when given valid ID and payload", async () => {
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

    it("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const mockPayload = generateUpdatedSpacePayload();
      const error = new Error("Ad space not found");

      updateAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.update(mockParams, mockPayload)).rejects.toThrow(
        error,
      );
      expect(updateAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockId,
        mockPayload,
      );
    });
  });

  describe("delete", () => {
    it("should delete an AdSpace with the correct ID", async () => {
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

    it("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      deleteAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.delete(mockParams)).rejects.toThrow(error);
      expect(deleteAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams.id);
    });
  });
});
