import { CookieOptions } from "express";

export const JWT_COOKIES = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

export const JWT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
