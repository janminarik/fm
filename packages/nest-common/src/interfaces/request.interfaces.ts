import { Request } from "express";

export interface IUser {
  id?: string;
}
export interface IRequestContextParams {
  params: Record<string, string>;
  query: Record<string, string | string[] | undefined>;
  body: Record<string, unknown>;
  cookies: Record<string, string>;
}

export interface IRequestContext {
  headers: Record<string, string | string[] | undefined>;
  params: IRequestContextParams;
  user?: IUser;
}

export interface IRequest extends Request {
  id: string;
  user?: IUser;
  context?: IRequestContext;
}
