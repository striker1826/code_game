import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { QuestionModule } from './modules/question/question.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GradingModule } from './modules/grading/grading.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    QuestionModule,
    AuthModule,
    GradingModule,
    RoomModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
