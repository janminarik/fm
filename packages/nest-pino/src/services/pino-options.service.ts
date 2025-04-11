import { IncomingMessage, ServerResponse } from "http";

import { Injectable } from "@nestjs/common";
import {
  BaseLoggerConfig,
  Environment,
  generateId,
  IRequest,
  LOGGER_RESTRICTED_SENSITIVE_ATTRIBUTES,
  REQUEST_USER_AGENT_HEADER,
  REQUEST_ID_HEADER,
} from "@repo/nest-common";
import { Response } from "express";
import { TransportTargetOptions } from "pino";

import type { Options as PinoHttpOptions } from "pino-http";

interface ExtendedError extends Error {
  statusCode?: number;
}

export interface PinoOptions {
  pinoHttp: PinoHttpOptions;
}

@Injectable()
export class PinoOptionsService {
  create(
    config: BaseLoggerConfig,
    transport: { targets: TransportTargetOptions[] },
  ): PinoOptions {
    return {
      pinoHttp: {
        level: config.logLevel,
        autoLogging: false,
        genReqId: (req: IncomingMessage, res: ServerResponse) =>
          this.generateRequestId(req, res),
        redact: {
          paths: [
            ...LOGGER_RESTRICTED_SENSITIVE_ATTRIBUTES.map((field) =>
              field.includes("-") || field.includes("_")
                ? `req.body["${field}"]`
                : `req.body.${field}`,
            ),
            ...LOGGER_RESTRICTED_SENSITIVE_ATTRIBUTES.map((field) =>
              field.includes("-") || field.includes("_")
                ? `req.headers["${field}"]`
                : `req.headers.${field}`,
            ),
          ],
          censor: "**GDPR COMPLIANT**",
          remove: true,
        },
        serializers: {
          req: (request: IRequest) => this.requestSerializer(request),
          res: (response: Response) => this.responseSerializer(response),
          err: (error: Error) =>
            this.errorSerializer(config.nodeEnv as Environment, error),
        },
        transport,
      },
    };
  }

  private generateRequestId = (req: IncomingMessage, res: ServerResponse) => {
    const requestId = req.id ?? req.headers[REQUEST_ID_HEADER];
    if (requestId) return requestId;
    const id = generateId();
    res.setHeader(REQUEST_ID_HEADER, id);
    return id;
  };

  private requestSerializer = (request: IRequest) => ({
    id: request.id,
    method: request.method,
    url: request.url,
    body: request.body,
    headers: request.headers,
    ip: request.ip,
    parameters: request.params,
    path: request.path,
    query: request.query,
    referer: request.headers.referer,
    user: request.user,
    userAgent: request.headers[REQUEST_USER_AGENT_HEADER],
  });

  private responseSerializer = (response: Response) => {
    const headers = response.headersSent ? response.getHeaders() : {};
    return {
      httpCode: response.statusCode,
      headers,
    };
  };

  private errorSerializer = (
    environment: Environment,
    error: ExtendedError,
  ) => ({
    type: error.name,
    message: error.message,
    code: error.statusCode ?? undefined,
    stack: environment === Environment.PRODUCTION ? undefined : error.stack,
  });
}
