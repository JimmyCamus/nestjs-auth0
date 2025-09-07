import { applyDecorators, UseInterceptors } from "@nestjs/common";
import {
  Auth0CallbackInterceptor,
  Auth0LoginInterceptor,
} from "../interceptors/auth0.interceptor";

/**
 * Decorator that applies the `Auth0CallbackInterceptor` to a route handler.
 *
 * Use this decorator to handle Auth0 callback logic in your controller methods.
 * This will process the Auth0 callback, exchange the code for an access token,
 * and attach the user information to the request object.
 *
 * @returns A method decorator that sets up the Auth0 callback interceptor.
 *
 * @example
 * ```typescript
 * @Auth0Callback()
 * async handleAuth0Callback(@Req req: WithAuth0User<Request>) {
 *   // your callback logic
 * }
 * ```
 */
export function Auth0Callback() {
  return applyDecorators(UseInterceptors(Auth0CallbackInterceptor));
}

/**
 * Decorator that applies the `Auth0LoginInterceptor` to a route handler.
 *
 * Use this decorator to enable Auth0 login interception for specific controller methods.
 * This will redirect users to the Auth0 login page.
 *
 * @returns A method decorator that applies the Auth0 login interceptor.
 *
 * @example
 * ```typescript
 * @Auth0Login()
 * async login() {} // You don't need to implement any logic here
 * ```
 */
export function Auth0Login() {
  return applyDecorators(UseInterceptors(Auth0LoginInterceptor));
}
