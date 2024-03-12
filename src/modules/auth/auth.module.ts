import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/utils/sessionSerializer';
import { LocalStrategy } from 'src/utils/localStrategy';
import { GithubOauthStrategy } from './github/github-oauth.strategy';
import { AuthRepository } from './auth.repository';
import { AuthRepositoryImpl } from './auth.repositoryImpl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, { provide: AuthRepository, useClass: AuthRepositoryImpl }, GithubOauthStrategy],
})
export class AuthModule {}
