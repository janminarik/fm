import { BaseEntity, ICreateBaseEntityProps } from "./base.entity";
import { User } from "./user.entity";

export enum AppTokenType {
  RefreshToken = "REFRESH_TOKEN",
  PasswordResetToken = "PASSWORD_RESET_TOKEN",
  EmailVerificationToken = "EMAIL_VERIFICATION_TOKEN",
}

export interface ICreateAppTokenProps extends ICreateBaseEntityProps {
  type: AppTokenType;
  userId: string;
  publicId?: string;
  value?: string;
  expiresAt?: Date;
  revoked?: boolean;
  revokedAt?: Date;
}

export class AppToken extends BaseEntity {
  constructor({
    id,
    type,
    userId,
    value,
    revoked,
    publicId,
    expiresAt,
    revokedAt,
    createdAt,
    updatedAt,
  }: ICreateAppTokenProps) {
    super({ id, createdAt, updatedAt });
    this._type = type;
    this._value = value ?? null;
    this._userId = userId;
    this._publicId = publicId ?? null;
    this._expiresAt = expiresAt ?? null;
    this._revoked = revoked ?? false;
    this._revokedAt = revokedAt ?? null;
  }

  private _type: AppTokenType;
  private _publicId: string | null;
  private _value: string | null;
  private _revoked: boolean;
  private _revokedAt: Date | null;
  private _expiresAt: Date | null;
  private _userId: string;
  private _user: User;

  get type(): AppTokenType {
    return this._type;
  }

  get publicId(): string | null {
    return this._publicId;
  }

  get value(): string | null {
    return this._value;
  }

  get revoked(): boolean {
    return this._revoked;
  }

  get revokedAt(): Date | null {
    return this._revokedAt;
  }

  get expiresAt(): Date | null {
    return this._expiresAt;
  }

  get userId(): string {
    return this._userId;
  }
}
