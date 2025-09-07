/**
 * Represents a user authenticated via Auth0.
 *
 * @property sub - The unique identifier for the user (subject).
 * @property given_name - The user's given (first) name. Optional.
 * @property family_name - The user's family (last) name. Optional.
 * @property nickname - The user's nickname.
 * @property name - The user's full name. Optional.
 * @property picture - URL to the user's profile picture.
 * @property updated_at - ISO 8601 timestamp of the last profile update.
 * @property email - The user's email address.
 * @property email_verified - Indicates whether the user's email has been verified.
 */
export interface Auth0User {
  sub: string;
  given_name?: string;
  family_name?: string;
  nickname: string;
  name?: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  access_token: string;
}

/**
 * Combines a given type `T` with a `user` property containing an `Auth0User` type,
 * optionally extended with additional properties `U`.
 *
 * @typeParam T - The base type to be extended.
 * @typeParam U - Additional properties to extend the `Auth0User` type (default is an empty object).
 *
 * @example
 * type MyType = { foo: string };
 * type Extended = WithAuth0User<MyType, { bar: number }>;
 * // Resulting type: { foo: string; user: Auth0User & { bar: number } }
 */
export type WithAuth0User<T, U = {}> = T & {
  user: Auth0User & U;
};
