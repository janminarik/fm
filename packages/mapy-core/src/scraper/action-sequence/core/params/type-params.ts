import { BaseActionParams } from "./base-action-params";

export interface TypeParams extends BaseActionParams {
  selector: string;
  text: string;
  delay?: number;
}
