export function getJwtToken(
  tokenName: string,
  cookies: any,
): string | undefined {
  return Array.isArray(cookies)
    ? cookies.find((cookie) => cookie.startsWith(tokenName))
    : undefined;
}
