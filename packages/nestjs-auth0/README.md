<div align="center">
<img width="200" height="200" src="https://github.com/user-attachments/assets/45a27923-9073-47c6-b963-cdbc72cd2c6c" />
<h1>@jimmycamus/nestjs-auth0</h1>
  
<p>Simple authentication and authorization for NestJS applications using Auth0. This package provides modules, decorators, and utilities to seamlessly integrate Auth0's OAuth2 flow into your controllers, handle callbacks, and access authenticated user data in a secure and transparent way. Ideal for projects that require social login, JWT, and user management with Auth0 in NestJS.</p>
</div>

## Installation

```bash
pnpm add  @jimmycamus/nestjs-auth0
```

## Basic Usage

```typescript
import { Module } from "@nestjs/common";
import { Auth0Module } from "@jimmycamus/nestjs-auth0";

@Module({
  imports: [
    Auth0Module.forRoot({
      domain: "YOUR_AUTH0_DOMAIN",
      clientId: "YOUR_AUTH0_CLIENT_ID",
      clientSecret: "YOUR_AUTH0_CLIENT_SECRET",
      redirectUri: "YOUR_AUTH0_REDIRECT_URI",
    }),
  ],
})
export class AppModule {}
```

## Asynchronous Configuration

```typescript
Auth0Module.forRootAsync({
  useFactory: async () => ({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    redirectUri: process.env.AUTH0_REDIRECT_URI,
  }),
});
```

## Using Decorators

This package provides decorators to simplify Auth0 integration inside your NestJS controllers.

`@Auth0Login()`

Redirects the user to the Auth0 login page.
You don’t need to implement any logic in the handler — the interceptor will handle the redirection.

```typescript
import { Controller, Get } from "@nestjs/common";
import { Auth0Login } from "@jimmycamus/nestjs-auth0";

@Controller()
export class AppController {
  @Get("authorize")
  @Auth0Login()
  authorize() {
    // No logic needed here, user will be redirected to Auth0
  }
}
```

`@Auth0Callback()`

Handles the Auth0 callback after login.
This decorator will:

- Process the Auth0 callback.
- Exchange the authorization code for an access token.
- Attach the authenticated user to the request object.

```typescript
import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { Auth0Callback, WithAuth0User } from "@jimmycamus/nestjs-auth0";

@Controller()
export class AppController {
  @Get("callback")
  @Auth0Callback()
  callback(@Req() req: WithAuth0User<Request>) {
    return { userData: req.user };
  }
}
```

### Combined Example

```typescript
import { Controller, Get, Req } from "@nestjs/common";
import {
  Auth0Callback,
  Auth0Login,
  WithAuth0User,
} from "@jimmycamus/nestjs-auth0";
import { Request } from "express";

@Controller()
export class ExampleController {
  constructor() {}

  @Get("authorize")
  @Auth0Login()
  authorize() {}

  @Get("callback")
  @Auth0Callback()
  callback(@Req() req: WithAuth0User<Request>) {
    return { userData: req.user };
  }
}
```

## Contributing

Contributions are welcome!
Open an issue or a PR to suggest new features and improvements.

## License

MIT
