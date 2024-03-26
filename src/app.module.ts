import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { QuestionModule } from './modules/question/question.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GradingModule } from './modules/grading/grading.module';
import { RoomModule } from './modules/room/room.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 30,
    //   },
    // ]),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).exclude({ path: '/api/health', method: RequestMethod.GET }).forRoutes('*');
  }
}
