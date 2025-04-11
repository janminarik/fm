import {
  jest,
  beforeEach,
  describe,
  expect,
  test,
  beforeAll,
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
import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { v4 as uuid4 } from "uuid";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import { AdSpaceDto, UpdateAdSpaceDto } from "./dto";
import { IdParams } from "../../common/dto/id.params";

describe("AdSpaceControllerV1", () => {
  let controller: AdSpaceControllerV1;
  let getAdSpaceUseCaseMock: MockProxy<GetAdSpaceUseCase>;
  let createAdSpaceUseCaseMock: MockProxy<CreateAdSpaceUseCase>;
  let updateAdSpaceUseCaseMock: MockProxy<UpdateAdSpaceUseCase>;
  let deleteAdSpaceUseCaseMock: MockProxy<DeleteAdSpaceUseCase>;
  let listAdSpaceUseCaseMock: MockProxy<ListAdSpaceUseCase>;
  let mapperMock: MockProxy<AdSpaceMapper>;

  beforeAll(async () => {
    getAdSpaceUseCaseMock = mock<GetAdSpaceUseCase>();
    createAdSpaceUseCaseMock = mock<CreateAdSpaceUseCase>();
    deleteAdSpaceUseCaseMock = mock<DeleteAdSpaceUseCase>();
    updateAdSpaceUseCaseMock = mock<UpdateAdSpaceUseCase>();
    listAdSpaceUseCaseMock = mock<ListAdSpaceUseCase>();
    mapperMock = mock<AdSpaceMapper>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdSpaceControllerV1],
      providers: [
        { provide: GetAdSpaceUseCase, useValue: getAdSpaceUseCaseMock },
        { provide: CreateAdSpaceUseCase, useValue: createAdSpaceUseCaseMock },
        { provide: UpdateAdSpaceUseCase, useValue: updateAdSpaceUseCaseMock },
        { provide: DeleteAdSpaceUseCase, useValue: deleteAdSpaceUseCaseMock },
        { provide: ListAdSpaceUseCase, useValue: listAdSpaceUseCaseMock },
        { provide: AdSpaceMapper, useValue: mapperMock },
      ],
    }).compile();

    controller = module.get<AdSpaceControllerV1>(AdSpaceControllerV1);
  });

  beforeEach(() => {
    mockReset(getAdSpaceUseCaseMock);
    mockReset(createAdSpaceUseCaseMock);
    mockReset(updateAdSpaceUseCaseMock);
    mockReset(deleteAdSpaceUseCaseMock);
    mockReset(listAdSpaceUseCaseMock);
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

      listAdSpaceUseCaseMock.execute.mockResolvedValue(mockResponse);
      mapperMock.toList.mockReturnValue(mockDtos);

      const result = await controller.listPagination(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(listAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(mockParams);
      expect(mapperMock.toList).toHaveBeenCalledWith(AdSpaceDto, mockEntities);
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

      listAdSpaceUseCaseMock.execute.mockResolvedValue(mockResponse);
      mapperMock.toList.mockReturnValue([]);

      const result = await controller.listPagination(mockParams);

      expect(listAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(mockParams);
      expect(mapperMock.toList).toHaveBeenCalledWith(AdSpaceDto, []);
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

      getAdSpaceUseCaseMock.execute.mockResolvedValue(mockEntity);
      mapperMock.to.mockReturnValue(mockResponse);

      const result = await controller.get(mockParams);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParams);
      expect(getAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(mockParams.id);
      expect(mapperMock.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(result).toEqual(mockResponse);
    });

    test("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      getAdSpaceUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.get(mockParams)).rejects.toThrow(error);
      expect(getAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(mockParams.id);
    });
  });

  describe("create", () => {
    test("should create and return an AdSpaceDto when given valid payload", async () => {
      const mockPayload = generateCreateAdSpacePayload();
      const mockEntity = createAdSpaceFake();
      const mockResponse = { ...mockEntity, id: uuid4() } as AdSpaceDto;

      const controllerSpy = jest.spyOn(controller, "create");

      createAdSpaceUseCaseMock.execute.mockResolvedValue(mockEntity);
      mapperMock.to.mockReturnValue(mockResponse);

      const result = await controller.create(mockPayload);

      expect(controllerSpy).toHaveBeenCalledWith(mockPayload);
      expect(createAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(
        mockPayload,
      );
      expect(mapperMock.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
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

      mapperMock.to.mockReturnValue(mockResponse);
      updateAdSpaceUseCaseMock.execute.mockResolvedValue(mockEntity);

      const result = await controller.update(mockParams, mockPayload);

      expect(controllerUpdateSpy).toHaveBeenCalledWith(mockParams, mockPayload);
      expect(mapperMock.to).toHaveBeenCalledWith(AdSpaceDto, mockEntity);
      expect(updateAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(
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

      updateAdSpaceUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.update(mockParams, mockPayload)).rejects.toThrow(
        error,
      );
      expect(updateAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(
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

      deleteAdSpaceUseCaseMock.execute.mockResolvedValue(mockEntity);

      await controller.delete(mockParamas);

      expect(controllerSpy).toHaveBeenLastCalledWith(mockParamas);
      expect(deleteAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(
        mockParamas.id,
      );
    });

    test("should throw an error when ad space with specified ID does not exist", async () => {
      const mockId = uuid4();
      const mockParams: IdParams = {
        id: mockId,
      };
      const error = new Error("Ad space not found");

      deleteAdSpaceUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.delete(mockParams)).rejects.toThrow(error);
      expect(deleteAdSpaceUseCaseMock.execute).toHaveBeenCalledWith(
        mockParams.id,
      );
    });
  });
});
