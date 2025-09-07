import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Auth0ModuleOptions } from "../interfaces/auth0-options.interface";
import { AUTH0_INJECTOR } from "../constants/injectors.constant";

@Injectable()
export class Auth0Service {
  private responseType = "code";
  private grantType = "authorization_code";

  constructor(
    @Inject(AUTH0_INJECTOR) private options: Auth0ModuleOptions,
    private httpService: HttpService
  ) {}

  /**
   * Generates the Auth0 authorization URL with the configured parameters.
   *
   * Constructs a URL for initiating the OAuth2 authorization flow with Auth0,
   * including response type, client ID, redirect URI, scope, and audience.
   *
   * @returns {Promise<string>} A promise that resolves to the authorization URL.
   */
  async getAuthorizationUrl(): Promise<string> {
    const params = new URLSearchParams({
      response_type: this.responseType,
      client_id: this.options.clientId,
      redirect_uri: this.options.redirectUri,
      scope: this.options.scope,
      audience: this.options.audience,
    }).toString();

    return `https://${this.options.domain}/authorize?${params}`;
  }

  /**
   * Exchanges an authorization code for an access token using Auth0's OAuth endpoint.
   *
   * @param code - The authorization code received from Auth0 after user authentication.
   * @returns A promise that resolves to the access token string.
   * @throws {UnauthorizedException} If the access token cannot be fetched.
   */
  async getAccessToken(code: string): Promise<string> {
    const url = `https://${this.options.domain}/oauth/token`;
    const headers = { "content-type": "application/json" };
    const body = {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      audience: this.options.audience,
      grant_type: this.grantType,
      redirect_uri: this.options.redirectUri,
      code,
    };

    return lastValueFrom(
      this.httpService.post(url, body, { headers }).pipe(
        map((response) => response.data.access_token),
        catchError(() => {
          throw new UnauthorizedException("Failed to fetch access token");
        })
      )
    );
  }

  /**
   * Retrieves user information from Auth0 using the provided access token.
   *
   * @param accessToken - The access token used to authenticate the request.
   * @returns A promise that resolves with the user information returned by Auth0.
   * @throws {UnauthorizedException} If the user information cannot be fetched.
   */
  async getUserInfo(accessToken: string): Promise<any> {
    const url = `https://${this.options.domain}/userinfo`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return lastValueFrom(
      this.httpService.get(url, { headers }).pipe(
        map((res) => res.data),
        catchError(() => {
          throw new UnauthorizedException("Failed to fetch user info");
        })
      )
    );
  }
}
