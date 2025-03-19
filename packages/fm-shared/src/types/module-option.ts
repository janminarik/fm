import { Provider } from "@nestjs/common";

export interface IBaseModuleOptions {
  global?: boolean;
  providers?: Provider<any>[];
}
