import { ReactNode } from "react";

export class AppError {
  readonly code?: number | string;
  readonly details?: unknown;
  readonly message: string;

  constructor(message: string, code?: number | string, details?: unknown) {
    this.code = code;
    this.message = message;
    this.details = details;
  }

  format(): string {
    return `${this.code} - ${this.message}`;
  }

  toPlain(): { message: string; code?: string | number } {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export enum Language {
  English = "en",
  Slovak = "sk",
}

export enum ThemeName {
  Dark = "dark",
  Light = "light",
}

export interface CurrentUser {
  avatarUrl?: string;
  email?: string;
  firstName?: string;
  id: string;
  lastName?: string;
}

export type MenuItem = {
  icon?: ReactNode;
  kind: "menuitem";
  label: string;
  subMenu?: MenuItem[];
  to?: string;
};

export type NavigationMenuItem = MenuItem | SubHeaderItem;

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    count: number;
    total: number;
    page: number;
    totalPage: number;
  };
}

export type SubHeaderItem = {
  kind: "subheader";
  label: string;
};

// export interface TokenPayload {
//   userId: string;
// }

export interface LoginResponseDto {
  accessToken: string;
  accessTokenExpiration: number;

  refreshToken: string;
  refreshTokenExpiration: number;
}
