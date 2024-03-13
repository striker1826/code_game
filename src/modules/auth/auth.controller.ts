import { Body, Controller, Get, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/utils/localGuard';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/utils/authenticated.guard';
import { session } from 'passport';
import { GithubCodeDto } from './dto/github.dto';
import { GithubOauthGuard } from './strategy/github/github-oauth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GithubOauthGuard)
  @Get('github')
  public async signupGithub(@User() user: UserDto): Promise<string> {
    const access_token = await this.authService.socialLogin(user);
    return access_token;
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async logIn(@Session() session: Record<string, any>) {
  //   session.authenticated = true;
  //   return { userId: 'asdf', userName: 'kim' };
  // }

  // @UseGuards(AuthenticatedGuard)
  // @Get()
  // async test(@Req() req: Request) {
  //   return req.user;
  // }

  // @UseGuards(AuthenticatedGuard)
  // @Get('protected')
  // async getAuthStatus(@Req() req: Request) {
  //   return req.user;
  // }

  // @Get('/logout')
  // logout(@Req() req: Request) {
  //   console.log(req.session);
  //   req.session.destroy(() => {
  //     req.session.id;
  //   });
  //   console.log('logout');
  //   return;
  // }
}
