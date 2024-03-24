import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GithubCodeDto } from './dto/github.dto';
import axios, { AxiosResponse } from 'axios';
import { AuthRepository } from './auth.repository';
import { UserDto } from './dto/user.dto';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: UserDto): Promise<User> {
    const result = await this.authRepository.saveUser(user);
    return result;
  }

  async socialLogin(user: UserDto) {
    let userInfo: User;
    userInfo = await this.authRepository.findUserByUsername(user.username);
    if (!userInfo) {
      userInfo = await this.createUser(user);
    }

    const access_token = this.generatedAccessToken(userInfo);
    return access_token;
  }

  generatedAccessToken({ userId, nickname, profileUrl }: User): string {
    const access_token = this.jwtService.sign(
      { userId, nickname, profileUrl },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '24h' },
    );

    return access_token;
  }

  async testLogin(data) {
    const access_token = this.generatedAccessToken(data);
    return access_token;
  }
}
