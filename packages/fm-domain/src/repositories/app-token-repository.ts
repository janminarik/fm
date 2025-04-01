import { AppToken, AppTokenType } from "../entities";
import { IBaseEntityRepository } from "./base/base-entity-repository";

export type CreateAppToken = {
  publicId: string;
  value: string;
  expiresAt: Date;
  userId: string;
  type: AppTokenType;
};

export interface IAppTokenRepository
  extends IBaseEntityRepository<AppToken, CreateAppToken> {
  findToken(userId: string, tokenId: string): Promise<AppToken | null>;
  revokeToken(userId: string, tokenId: string): Promise<AppToken | null>;
}

export const APP_TOKEN_REPOSITORY = Symbol("APP_TOKEN_REPOSITORY");
