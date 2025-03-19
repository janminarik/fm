export type ApiConfig = {
  nodeEnv: string;
  name: string;
  port: number;
  corsOrigin: boolean | string | string[];
  apiDocsEnabled: boolean;
  debug: boolean;

  bodyJsonMaxSize: string;
  bodyUrlEncodedMaxSize: string;
  bodyUrlTextMaxSize: string;
  bodyUrlRawMaxSize: string;
};
