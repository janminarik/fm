export function getJwtToken(
  tokenName: string,
  cookies: any,
): string | undefined {
  return Array.isArray(cookies)
    ? (cookies.find(
        (cookie) => typeof cookie === "string" && cookie.startsWith(tokenName),
      ) as string | undefined)
    : undefined;
}
