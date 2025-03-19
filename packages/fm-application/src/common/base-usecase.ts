export interface IBaseUseCase {
  execute(...args: unknown[]): Promise<unknown>;
}
