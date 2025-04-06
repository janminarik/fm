import { BaseActionParams } from "./base-action-params";

export interface SelectParams extends BaseActionParams {
  selector: string;
  values: string[];
}
