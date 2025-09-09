import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Auth0Callback,
  Auth0Login,
  WithAuth0User,
} from '@jimmycamus/nestjs-auth0';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('authorize')
  @Auth0Login()
  authorize() {}

  @Get('callback')
  @Auth0Callback()
  callback(@Req() req: WithAuth0User<Request>) {
    return { userData: req.user };
  }
}
