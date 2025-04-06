import { BaseActionParams } from "./base-action-params";

export interface WaitForSelectorParams extends BaseActionParams {
  selector: string;
  visible?: boolean;
  timeout?: number;
}
