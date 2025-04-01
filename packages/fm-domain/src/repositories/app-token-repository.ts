import { AppToken } from "../entities";
import { IBaseEntityRepository } from "./base/base-entity-repository";

export interface IAppTokenRepository extends IBaseEntityRepository<AppToken> {
  findToken(userId: string, tokenId: string): Promise<AppToken | null>;
  revokeToken(userId: string, tokenId: string): Promise<AppToken | null>;
}

export const APP_TOKEN_REPOSITORY = Symbol("APP_TOKEN_REPOSITORY");
