export interface LoggerConfigProvider<T> {
  namespace: string;
  provideToken: string;
  configFactory: () => T;
}
