import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
