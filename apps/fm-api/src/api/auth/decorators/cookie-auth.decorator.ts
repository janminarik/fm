import { UseInterceptors } from "@nestjs/common";

import { LoginInterceptor, LogoutInterceptor } from "../interceptors";

export default function CookieAuthentication(
  method: "login" | "logout" | "refresh-tokens" | "refresh-access-token",
): MethodDecorator & ClassDecorator {
  if (
    method === "login" ||
    method === "refresh-tokens" ||
    method === "refresh-access-token"
  ) {
    return UseInterceptors(LoginInterceptor);
  } else if (method === "logout") {
    return UseInterceptors(LogoutInterceptor);
  }
}
