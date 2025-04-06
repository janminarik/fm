import { BaseActionParams } from "./base-action-params";

export interface EvaluateParams extends BaseActionParams {
  function: string | Function;
  args?: any[];
}
