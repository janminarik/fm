import { Request } from "express";

export interface IUser {
  id: string;
}
export interface IRequestContextParams {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
}

export interface IRequestContext {
  headers?: Record<string, any>;
  params?: IRequestContextParams;
  user?: IUser;
}

export interface IRequest extends Request {
  id: string;
  user?: any;
}
