import {
  jest,
  beforeEach,
  describe,
  expect,
  test,
  afterEach,
} from "@jest/globals";
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
import { mock, MockProxy } from "jest-mock-extended";
import { v4 as uuid4 } from "uuid";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import { AdSpaceDto, UpdateAdSpaceDto } from "./dto";
import { IdParams } from "../../common/dto/id.params";

describe("AdSpaceControllerV1", () => {
  let controller: AdSpaceControllerV1;
  let mockGetAdSpaceUseCase: MockProxy<GetAdSpaceUseCase>;
  let mockCreateAdSpaceUseCase: MockProxy<CreateAdSpaceUseCase>;
  let mockUpdateAdSpaceUseCase: MockProxy<UpdateAdSpaceUseCase>;
  let mockDeleteAdSpaceUseCase: MockProxy<DeleteAdSpaceUseCase>;
  let mockListAdSpaceUseCase: MockProxy<ListAdSpaceUseCase>;
  let mockMapper: MockProxy<AdSpaceMapper>;

  beforeEach(async () => {
    mockGetAdSpaceUseCase = mock<GetAdSpaceUseCase>();
    mockCreateAdSpaceUseCase = mock<CreateAdSpaceUseCase>();
    mockDeleteAdSpaceUseCase = mock<DeleteAdSpaceUseCase>();
    mockUpdateAdSpaceUseCase = mock<UpdateAdSpaceUseCase>();
    mockListAdSpaceUseCase = mock<ListAdSpaceUseCase>();
    mockMapper = mock<AdSpaceMapper>();

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("listPagination", () => {
    test("should return a paginated list of AdSpaceDto with proper metadata", async () => {
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

      mockListAdSpaceUseCase.execute.mockResolvedValue(mockResponse);
      mockMapper.toList.mockReturnValue(mockDtos);

      const result = await controller.listPagination(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(mockListAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams);
      expect(mockMapper.toList).toHaveBeenCalledWith(AdSpaceDto, mockEntities);
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

    test("should return an empty list when no ad spaces exist", async () => {
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

      mockListAdSpaceUseCase.execute.mockResolvedValue(mockResponse);
      mockMapper.toList.mockReturnValue([]);

      const result = await controller.listPagination(mockParams);

      expect(mockListAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams);
      expect(mockMapper.toList).toHaveBeenCalledWith(AdSpaceDto, []);
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
    test("should return an AdSpaceDto when provided with a valid ID", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const mockEntity: AdSpace = createAdSpaceFake();
      const mockResponse = { ...mockEntity } as AdSpaceDto;
      const controllerSpy = jest.spyOn(controller, "get");

      mockGetAdSpaceUseCase.execute.mockResolvedValue(mockEntity);
      mockMapper.to.mockReturnValue(mockResponse);

      const result = await controller.get(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(mockGetAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams.id);
      expect(mockMapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(result).toEqual(mockResponse);
    });

    test("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      mockGetAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.get(mockParams)).rejects.toThrow(error);
      expect(mockGetAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams.id);
    });
  });

  describe("create", () => {
    test("should create and return an AdSpaceDto when given valid payload", async () => {
      const mockPayload = generateCreateAdSpacePayload();
      const mockEntity = createAdSpaceFake();
      const mockResponse = { ...mockEntity, id: uuid4() } as AdSpaceDto;

      const controllerSpy = jest.spyOn(controller, "create");

      mockCreateAdSpaceUseCase.execute.mockResolvedValue(mockEntity);
      mockMapper.to.mockReturnValue(mockResponse);

      const result = await controller.create(mockPayload);

      expect(controllerSpy).toHaveBeenCalledWith(mockPayload);
      expect(mockCreateAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockPayload,
      );
      expect(mockMapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    test("should update and return AdSpaceDto when given valid ID and payload", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };

      const newAdSpaceName = "updated-name";

      const mockPayload: UpdateAdSpaceDto = { name: newAdSpaceName };

      const mockEntity = createAdSpaceFake(mockId, newAdSpaceName);
      const mockResponse = mockEntity;

      const controllerUpdateSpy = jest.spyOn(controller, "update");

      mockMapper.to.mockReturnValue(mockResponse);
      mockUpdateAdSpaceUseCase.execute.mockResolvedValue(mockEntity);

      const result = await controller.update(mockParams, mockPayload);

      expect(controllerUpdateSpy).toHaveBeenCalledWith(mockParams, mockPayload);
      expect(mockMapper.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(mockUpdateAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockId,
        mockPayload,
      );
      expect(result).toEqual(mockResponse);
    });

    test("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const mockPayload = generateUpdatedSpacePayload();
      const error = new Error("Ad space not found");

      mockUpdateAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.update(mockParams, mockPayload)).rejects.toThrow(
        error,
      );
      expect(mockUpdateAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockId,
        mockPayload,
      );
    });
  });

  describe("delete", () => {
    test("should delete an AdSpace with the correct ID", async () => {
      const mockId = uuid4();
      const mockParamas: IdParams = {
        id: mockId,
      };

      const mockEntity = createAdSpaceFake(mockId);

      const controllerSpy = jest.spyOn(controller, "delete");

      mockDeleteAdSpaceUseCase.execute.mockResolvedValue(mockEntity);

      await controller.delete(mockParamas);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParamas);
      expect(mockDeleteAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockParamas.id,
      );
    });

    test("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      mockDeleteAdSpaceUseCase.execute.mockRejectedValue(error);

      await expect(controller.delete(mockParams)).rejects.toThrow(error);
      expect(mockDeleteAdSpaceUseCase.execute).toHaveBeenCalledWith(
        mockParams.id,
      );
    });
  });
});
