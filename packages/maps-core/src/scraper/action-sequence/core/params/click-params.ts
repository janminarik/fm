import { BaseActionParams } from "./base-action-params";

export interface ClickParams extends BaseActionParams {
  selector: string;
  delay?: number;
  button?: "left" | "right" | "middle";
}
