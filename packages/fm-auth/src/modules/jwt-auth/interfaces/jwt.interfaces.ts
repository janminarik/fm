export interface IJwtOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
  expiresIn: number;
  notBefore?: number | string;
}

export interface IJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
  ignoreExpiration?: boolean;
}
