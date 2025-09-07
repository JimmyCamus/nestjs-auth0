/**
 * Options for configuring the Auth0 module.
 *
 * @property domain - The Auth0 domain (e.g., 'your-tenant.auth0.com').
 * @property clientId - The Auth0 application's client ID.
 * @property clientSecret - The Auth0 application's client secret.
 * @property redirectUri - The URI to redirect to after authentication.
 * @property audience - The API audience identifier for Auth0.
 * @property scope - The scopes to request during authentication (space-separated).
 */
export interface Auth0ModuleOptions {
  domain: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  audience: string;
  scope: string;
}
