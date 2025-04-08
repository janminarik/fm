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
import { createAdSpaceFake } from "@repo/fm-mock-data";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import { AdSpaceDto } from "./dto";
import { ListPaginationParams } from "../../common/dto/pagination/pagination-params.dto";

describe("AdSpaceControllerV1", () => {
  let controller: AdSpaceControllerV1;
  let getAdSpaceUseCase: { execute: jest.Mock };
  let createAdSpaceUseCase: { execute: jest.Mock };
  let updateAdSpaceUseCase: { execute: jest.Mock };
  let deleteAdSpaceUseCase: { execute: jest.Mock };
  let listAdSpaceUseCase: { execute: jest.Mock };
  let mapper: { toList: jest.Mock };

  beforeEach(async () => {
    // Create mock implementations for all dependencies
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

    // Create the testing module
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

    // Get the controller and mock dependencies
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

      const mockAdSpaces: AdSpace[] = [createAdSpaceFake()];

      const mockPaginatedResult: IListPaginationResult<AdSpace> = {
        data: mockAdSpaces,
        meta: {
          count: 1,
          total: 1,
          page: 1,
          totalPage: 10,
        },
      };

      const mockDtos: AdSpaceDto[] = mockAdSpaces.map(
        (adspace) => ({ ...adspace }) as AdSpaceDto,
      );

      listAdSpaceUseCase.execute.mockResolvedValue(mockPaginatedResult);
      mapper.toList.mockReturnValue(mockDtos);

      const result = await controller.listPagination(mockParams);

      expect(listAdSpaceUseCase.execute).toHaveBeenCalledWith(mockParams);

      expect(mapper.toList).toHaveBeenCalledWith(AdSpaceDto, mockAdSpaces);

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
});
