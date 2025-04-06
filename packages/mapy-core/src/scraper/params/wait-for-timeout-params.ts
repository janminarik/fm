import { BaseActionParams } from "./base-action-params";

export interface WaitForTimeoutParams extends BaseActionParams {
  timeout: number;
}
