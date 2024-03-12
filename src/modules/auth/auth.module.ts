import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/utils/sessionSerializer';
import { LocalStrategy } from 'src/utils/localStrategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
