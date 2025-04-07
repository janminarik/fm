import { TransportTargetOptions } from "pino";
import * as PinoPretty from "pino-pretty";

export const createPinoPretty = (
  level: string,
  options?: PinoPretty.PrettyOptions,
): TransportTargetOptions => {
  return {
    target: "pino-pretty",
    level,
    options: options ?? { colorize: true, singleLine: false },
  };
};
