export function getJwtToken(
  tokenName: string,
  cookies: any,
): string | undefined {
  return Array.isArray(cookies)
    ? cookies.find((cookie) => (cookie as string).startsWith(tokenName))
    : undefined;
}

// function getCookie(val: any): string {
//   if ((val as string).startsWith("cookieName=")) {
//     return val;
//   }
//   return "";
// }
