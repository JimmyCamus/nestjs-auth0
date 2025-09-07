import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auth0Module } from 'nestjs-auth0';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Auth0Module.forRootAsync({
      useFactory: (config: ConfigService) => ({
        domain: config.get<string>('AUTH0_DOMAIN', ''),
        clientId: config.get<string>('AUTH0_CLIENT_ID', ''),
        clientSecret: config.get<string>('AUTH0_CLIENT_SECRET', ''),
        redirectUri: config.get<string>('AUTH0_REDIRECT_URI', ''),
        audience: config.get<string>('AUTH0_AUDIENCE', ''),
        scope: config.get<string>('AUTH0_SCOPE', 'openid profile email'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
