import { Controller, Get, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/utils/localGuard';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/utils/authenticated.guard';
import { session } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Session() session: Record<string, any>) {
    session.authenticated = true;
    return { userId: 'asdf', userName: 'kim' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async test(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  async getAuthStatus(@Req() req: Request) {
    return req.user;
  }

  @Get('/logout')
  logout(@Req() req: Request) {
    console.log(req.session);
    req.session.destroy(() => {
      req.session.id;
    });
    console.log('logout');
    return;
  }
}
