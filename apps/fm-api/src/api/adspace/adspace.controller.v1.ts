import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  CreateAdSpaceUseCase,
  DeleteAdSpaceUseCase,
  GetAdSpaceUseCase,
  ListAdSpaceUseCase,
  UpdateAdSpaceUseCase,
} from "@repo/fm-application";

import { AdSpaceMapper } from "./adspace.mapper";
import {
  CreateAdSpaceDoc,
  DeleteAdSpaceDoc,
  GetAdSpaceDoc,
  GetAdSpacesDoc,
  UpdateAdSpaceDoc,
} from "./doc/adspace.doc";
import { AdSpaceDto, CreateAdSpaceDto, UpdateAdSpaceDto } from "./dto";
import Authentication from "../../common/decorators/authentication.decorator";
import {
  IdParams,
  ListPaginationParams,
  PaginationResponseDto,
} from "../../common/dto";

@ApiTags("adspace")
@Authentication()
@Controller({ version: "1", path: "adspace" })
export class AdSpaceControllerV1 {
  constructor(
    private readonly getAdSpaceUseCase: GetAdSpaceUseCase,
    private readonly createAdSpaceUseCase: CreateAdSpaceUseCase,
    private readonly updateAdSpaceUseCase: UpdateAdSpaceUseCase,
    private readonly deleteAdSpaceUseCase: DeleteAdSpaceUseCase,
    private readonly listAdSpaceUseCase: ListAdSpaceUseCase,
    private readonly mapper: AdSpaceMapper,
  ) {}

  @GetAdSpacesDoc()
  @Get("/list")
  async listPagination(
    @Query() params: ListPaginationParams,
  ): Promise<PaginationResponseDto<AdSpaceDto>> {
    const { data, ...rest } = await this.listAdSpaceUseCase.execute(params);
    const dtos = this.mapper.toList(AdSpaceDto, data);
    return { ...rest, data: dtos };
  }

  @GetAdSpaceDoc()
  @Get(":id")
  async get(@Param() { id }: IdParams): Promise<AdSpaceDto> {
    const adSpace = await this.getAdSpaceUseCase.execute(id);
    return this.mapper.to(AdSpaceDto, adSpace);
  }

  @CreateAdSpaceDoc()
  @Post("/create")
  async create(@Body() adSpaceDto: CreateAdSpaceDto): Promise<AdSpaceDto> {
    const adSpace = await this.createAdSpaceUseCase.execute({ ...adSpaceDto });
    return this.mapper.to(AdSpaceDto, adSpace);
  }

  @UpdateAdSpaceDoc()
  @Patch(":id")
  async update(
    @Param() { id }: IdParams,
    @Body() adSpaceDto: UpdateAdSpaceDto,
  ): Promise<AdSpaceDto> {
    const adSpace = await this.updateAdSpaceUseCase.execute(id, {
      ...adSpaceDto,
    });
    return this.mapper.to(AdSpaceDto, adSpace);
  }

  @DeleteAdSpaceDoc()
  @HttpCode(204)
  @Delete(":id")
  async delete(@Param() { id }: IdParams): Promise<void> {
    await this.deleteAdSpaceUseCase.execute(id);
  }
}
