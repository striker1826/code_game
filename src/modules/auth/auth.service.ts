import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GithubCodeDto } from './dto/github.dto';
import axios, { AxiosResponse } from 'axios';
import { AuthRepository } from './auth.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(AuthRepository) private readonly authRepository: AuthRepository) {}

  async createUser(user: UserDto): Promise<void> {
    await this.authRepository.saveUser(user);
    return;
  }
}
