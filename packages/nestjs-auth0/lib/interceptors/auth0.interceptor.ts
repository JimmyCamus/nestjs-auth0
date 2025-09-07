import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { EMPTY } from "rxjs";
import { Auth0Service } from "../services/auth0.service";

/**
 * Interceptor that redirects incoming HTTP requests to the Auth0 login page.
 *
 * This interceptor uses the `Auth0Service` to generate an authorization URL
 * and redirects the HTTP response to that URL, initiating the Auth0 login flow.
 *
 * @remarks
 * This should be applied to routes that require authentication via Auth0.
 *
 * @example
 * ```typescript
 * @UseInterceptors(Auth0LoginInterceptor)
 * ```
 *
 * @param auth0Service - Service used to generate the Auth0 authorization URL.
 */
@Injectable()
export class Auth0LoginInterceptor implements NestInterceptor {
  constructor(private readonly auth0Service: Auth0Service) {}

  async intercept(context: ExecutionContext, _next: CallHandler<any>) {
    const res = context.switchToHttp().getResponse();

    const loginUrl = await this.auth0Service.getAuthorizationUrl();

    res.redirect(loginUrl);

    return EMPTY;
  }
}

/**
 * Interceptor that handles Auth0 callback logic.
 *
 * Extracts the authorization code from the request query parameters,
 * exchanges it for an access token using the Auth0Service, retrieves
 * user information, and attaches it to the request object.
 *
 * Throws an UnauthorizedException if the code is not provided.
 *
 * @remarks
 * This interceptor is intended to be used in routes handling Auth0 authentication callbacks.
 *
 * @param auth0Service - Service used to interact with Auth0 APIs.
 */
@Injectable()
export class Auth0CallbackInterceptor implements NestInterceptor {
  constructor(private readonly auth0Service: Auth0Service) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const code = request.query.code as string;

    if (!code) {
      throw new UnauthorizedException("Code not provided");
    }

    const accessToken = await this.auth0Service.getAccessToken(code);

    const userInfo = await this.auth0Service.getUserInfo(accessToken);

    request.user = { ...userInfo, access_token: accessToken };

    return next.handle();
  }
}
