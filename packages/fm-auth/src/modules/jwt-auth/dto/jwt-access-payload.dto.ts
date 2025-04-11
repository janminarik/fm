import { IUser } from "@repo/nest-common";

export class JwtAccessPayloadDto implements IUser {
  id: string;
  /**
   * JWT ID
   * A unique identifier for the token.
   * Standard claim (jti) used for tracking and revoking tokens if necessary.
   */
  jti: string;

  /**
   * User ID
   * Unique identifier of the user.
   */
  userId: string;

  /**
   * User Email
   * Email address of the user.
   */
  email?: string;

  /**
   * Issued At
   * Timestamp indicating when the token was issued.
   * This is a standard JWT claim to verify the token's creation time.
   */
  iat?: number;

  /**
   * Not Before
   * Timestamp indicating that the token should not be considered valid before this time.
   * Ensures the token is not usable until the specified time.
   */
  nbf?: number;

  /**
   * Expiration Time
   * Timestamp indicating when the token will expire.
   * After this time, the token should be considered invalid and the user must reauthenticate.
   */
  exp?: number;

  /**
   * Audience
   * Specifies the intended recipient of the token (e.g., a specific application or user group).
   * Helps prevent token misuse in unintended contexts.
   */
  aud?: string;

  /**
   * Issuer
   * Identifies the entity that issued the token (e.g., the authorization server).
   * Used to verify that the token originates from a trusted source.
   */
  iss?: string;

  /**
   * Subject
   * Identifies the subject of the token, often the user's unique identifier.
   * Links the token to a specific entity in the system.
   */
  sub?: string;

  /**
   * Nonce
   * A unique number or string used once to ensure token uniqueness and protect against replay attacks.
   */
  nonce?: number;
}
