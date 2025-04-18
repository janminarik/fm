import { faker } from "@faker-js/faker";
import { AppTokenType } from "@repo/fm-domain";
import { v4 as uuidv4 } from "uuid";

export interface AppTokenPayload {
  value?: string;
  publicId?: string;
  userId: string;
  expiresAt?: Date;
  type?: AppTokenType;
}

export const createAppTokenPayload = (
  overrides?: Partial<AppTokenPayload>,
): AppTokenPayload => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

  return {
    value: overrides?.value ?? faker.string.alphanumeric(64),
    publicId: overrides?.publicId ?? uuidv4(),
    userId: overrides?.userId ?? uuidv4(),
    expiresAt: overrides?.expiresAt ?? expiresAt,
    type: overrides?.type ?? AppTokenType.RefreshToken,
  };
};
