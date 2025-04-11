import { Action } from "./action";
import { ActionType } from "./action.type";

export interface ActionResult<T extends ActionType = ActionType> {
  success: boolean;
  action?: Action<T>;
  error?: Error;
  data?: unknown;
}
