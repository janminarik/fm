import {
  GotoParams,
  WaitForSelectorParams,
  WaitForTimeoutParams,
  ClickParams,
  ScreenshotParams,
  TypeParams,
  SelectParams,
  GetContentParams,
  EvaluateParams,
  ClickIfExistsParams,
  SetViewportParams,
} from "../params";

export interface ActionParamsMap {
  goto: GotoParams;
  waitForSelector: WaitForSelectorParams;
  waitForTimeout: WaitForTimeoutParams;
  click: ClickParams;
  screenshot: ScreenshotParams;
  type: TypeParams;
  select: SelectParams;
  getContent: GetContentParams;
  evaluate: EvaluateParams;
  clickIfExists: ClickIfExistsParams;
  setViewport: SetViewportParams;
}
