import { ActionParamsMap } from "./action-params-maps";
import { ActionType } from "./action.type";

export interface Action<T extends ActionType = ActionType> {
  type: T;
  name?: string;
  params: ActionParamsMap[T];
  retries?: number;
  retryDelay?: number;
  optional?: boolean;
}
