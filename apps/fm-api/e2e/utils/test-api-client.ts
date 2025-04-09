/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from "@nestjs/common";
import request from "supertest";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type ApiResponse<T> = {
  data: T;
  response: request.Response;
  status: number;
};

export class TestApiClient {
  constructor(private readonly app: INestApplication) {}

  async request<TResponse>(
    method: HttpMethod,
    url: string,
    expectedStatus: number = 200,
    payload?: string | object,
    jwt?: string,
  ): Promise<ApiResponse<TResponse>> {
    const server = this.app.getHttpServer();
    const req = request(server)[method](url);

    if (payload && ["post", "put", "patch"].includes(method)) req.send(payload);

    if (jwt) req.set("Authorization", "Bearer " + jwt);

    const res = await req.expect(expectedStatus);

    return {
      data: res.body as TResponse,
      response: res,
      status: res.status,
    };
  }

  async get<TResponse>(url: string, expectedStatus?: number, jwt?: string) {
    return await this.request<TResponse>(
      "get",
      url,
      expectedStatus,
      undefined,
      jwt,
    );
  }

  async post<TResponse>(
    url: string,
    payload?: string | object,
    expectedStatus: number = 201,
    jwt?: string,
  ) {
    return await this.request<TResponse>(
      "post",
      url,
      expectedStatus,
      payload,
      jwt,
    );
  }

  async put<TResponse>(
    url: string,
    payload?: string | object,
    expectedStatus: number = 200,
    jwt?: string,
  ) {
    return await this.request<TResponse>(
      "put",
      url,
      expectedStatus,
      payload,
      jwt,
    );
  }

  async patch<TResponse>(
    url: string,
    payload?: string | object,
    expectedStatus: number = 200,
    jwt?: string,
  ) {
    return await this.request<TResponse>(
      "patch",
      url,
      expectedStatus,
      payload,
      jwt,
    );
  }

  async delete<TResponse>(
    url: string,
    payload?: string | object,
    expectedStatus: number = 204,
    jwt?: string,
  ) {
    return await this.request<TResponse>(
      "delete",
      url,
      expectedStatus,
      payload,
      jwt,
    );
  }
}
