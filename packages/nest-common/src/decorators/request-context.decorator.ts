import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { IRequestContext } from "../interfaces";

export const RequestContext = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { customContext: IRequestContext }>();

    if (data) return request.customContext[data];

    return request.customContext;
  },
);
