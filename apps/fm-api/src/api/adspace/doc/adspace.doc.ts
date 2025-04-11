import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  DocAuth,
  DocError,
  DocErrors,
  DocOperation,
  DocPaginatedResponse,
  DocRequest,
  DocResponse,
  ValidationErrorDto,
} from "@repo/nest-common";

import { PaginationResponseDto } from "../../../common/dto";
import { AdSpaceDto, CreateAdSpaceDto, UpdateAdSpaceDto } from "../dto";

const commonErrors = [
  DocError(
    {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    },
    ValidationErrorDto,
  ),
  DocError({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
];

const notFound = DocError({
  status: HttpStatus.NOT_FOUND,
  description: "Advertisement space not found",
});

const docAuth = DocAuth({
  jwtAccessToken: true,
  jwtAccessTokenName: "Authorization",
});

export function GetAdSpacesDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Get all ad spaces",
      description:
        "Retrieve a paginated list of all advertisement spaces with optional filtering and sorting",
    }),
    DocRequest({}),
    docAuth,
    DocPaginatedResponse(PaginationResponseDto, AdSpaceDto, {
      description: "A paginated list of advertisement spaces",
    }),
    DocErrors([...commonErrors]),
  );
}

export function GetAdSpaceDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Get an ad space by ID",
      description:
        "Retrieve details of a specific advertisement space by its ID",
    }),
    DocRequest({}),
    docAuth,
    DocResponse({
      description: "Advertisement space details retrieved successfully",
      type: AdSpaceDto,
    }),
    DocErrors([...commonErrors, notFound]),
  );
}

export function CreateAdSpaceDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Create a new ad space",
      description: "Add a new advertisement space to the database",
    }),
    DocRequest({ dto: CreateAdSpaceDto }),
    docAuth,
    DocResponse({
      status: HttpStatus.CREATED,
      description: "Advertisement space successfully created",
      type: AdSpaceDto,
    }),
    DocErrors([...commonErrors]),
  );
}

export function UpdateAdSpaceDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Update an ad space",
      description: "Modify the details of an existing advertisement space",
    }),
    DocRequest({ dto: UpdateAdSpaceDto }),
    docAuth,
    DocResponse({
      status: HttpStatus.OK,
      description: "Advertisement space updated successfully",
      type: AdSpaceDto,
    }),
    DocErrors([...commonErrors, notFound]),
  );
}

export function DeleteAdSpaceDoc(): MethodDecorator {
  return applyDecorators(
    DocOperation({
      summary: "Delete an ad space",
      description: "Remove an advertisement space from store",
    }),
    DocRequest({}),
    docAuth,
    DocResponse({
      status: HttpStatus.NO_CONTENT,
      description: "Advertisement space deleted successfully",
      type: AdSpaceDto,
    }),
    DocErrors([...commonErrors, notFound]),
  );
}
