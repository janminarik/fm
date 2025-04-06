import { BaseActionParams } from "./base-action-params";

export interface ClickIfExistsParams extends BaseActionParams {
  selector: string;
  delay?: number;
}
