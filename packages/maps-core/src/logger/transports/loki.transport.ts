import { TransportTargetOptions } from "pino";

export type PinoLokiLoggerOptions = {
  host: string; // Povinná URL adresa Loki servera
  basicAuth?: {
    username: string;
    password: string;
  }; // Nepovinné prihlasovacie údaje
  batch?: boolean; // Či sa majú logy posielať v dávkach
  interval?: number; // Interval odosielania dávok v sekundách
  timeout?: number; // Časový limit pre požiadavky
  labels?: Record<string, string>; // Dodatočné label-y pre Loki
  replaceTimestamp?: boolean; // Či nahradiť timestamp-y
};

export const createPinoLoki = (
  level: string,
  options: PinoLokiLoggerOptions,
): TransportTargetOptions => {
  return {
    target: "pino-loki",
    level,
    options: { ...options },
  };
};
