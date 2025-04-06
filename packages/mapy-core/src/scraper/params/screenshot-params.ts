import { BaseActionParams } from "./base-action-params";

export interface ScreenshotParams extends BaseActionParams {
  path?: string;
  fullPage?: boolean;
  type?: "png" | "jpeg";
  quality?: number;
  omitBackground?: boolean;
}
