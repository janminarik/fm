import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
} from "@nestjs/swagger";
import { ClassConstructor } from "class-transformer";

export enum DocRequestBodyType {
  JSON = "JSON",
  TEXT = "TEXT",
  NONE = "NONE",
}

export interface IDocRequestOptions<T = unknown> {
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  dto?: ClassConstructor<T>;
  bodyType?: DocRequestBodyType;
}

export function DocRequest(options: IDocRequestOptions): MethodDecorator {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  if (options?.bodyType === DocRequestBodyType.JSON) {
    docs.push(ApiConsumes("application/json"));
  } else if (options?.bodyType === DocRequestBodyType.TEXT) {
    docs.push(ApiConsumes("text/plain"));
  }

  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.dto) {
    docs.push(ApiBody({ type: options?.dto }));
  }

  return applyDecorators(...docs);
}
