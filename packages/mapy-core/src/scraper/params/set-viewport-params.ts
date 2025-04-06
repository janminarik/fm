import { BaseActionParams } from "./base-action-params";

export interface SetViewportParams extends BaseActionParams {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  isLandscape?: boolean;
}
