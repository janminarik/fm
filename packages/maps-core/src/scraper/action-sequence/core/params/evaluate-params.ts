import { BaseActionParams } from "./base-action-params";

export interface EvaluateParams extends BaseActionParams {
  function: string | ((...args: unknown[]) => unknown);
  args?: unknown[];
}
