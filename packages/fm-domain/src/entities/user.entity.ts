import { BaseEntity, ICreateBaseEntityProps } from "./base.entity";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface CreateUserProps extends ICreateBaseEntityProps {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  userName?: string;
  phoneNumber?: string;
  disabled?: boolean;
  passwordAttempt?: number;
  verified?: boolean;
  roles?: Role[];
  lastLogin?: Date;
  deletedAt?: Date;
}

export class User extends BaseEntity {
  constructor({
    id,
    createdAt,
    updatedAt,
    email,
    passwordHash,
    firstName,
    lastName,
    userName,
    phoneNumber,
    disabled,
    lastLogin,
    passwordAttempt,
    verified,
    deletedAt,
    roles,
  }: CreateUserProps) {
    super({ id, createdAt, updatedAt });
    this._email = email;
    this._passwordHash = passwordHash;
    this._firstName = firstName;
    this._lastName = lastName;
    this._userName = userName || null;
    this._phoneNumber = phoneNumber || null;
    this._disabled = disabled || false;
    this._lastLogin = lastLogin || null;
    this._passwordAttempt = passwordAttempt || 0;
    this._verified = verified || false;
    this._deletedAt = deletedAt || null;
    this._roles = roles || [Role.USER];
  }

  get userName(): string | null {
    return this._userName;
  }

  private _email: string;
  private _passwordHash: string;
  private _firstName: string;
  private _lastName: string;
  private _userName: string | null;
  private _phoneNumber: string | null;
  private _disabled: boolean;
  private _lastLogin: Date | null;
  private _passwordAttempt: number;
  private _verified: boolean;
  private _deletedAt: Date | null;
  private _roles: Role[];

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get passwordAttempt(): number {
    return this._passwordAttempt;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get roles(): Role[] {
    return this._roles;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get lastLogin(): Date | null {
    return this._lastLogin;
  }

  get verified(): boolean {
    return this._verified;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
