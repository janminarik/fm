import { BaseActionParams } from "./base-action-params";

export interface GotoParams extends BaseActionParams {
  url: string;
  waitUntil?: "networkidle0" | "networkidle2" | "domcontentloaded" | "load";
  timeout?: number;
}
