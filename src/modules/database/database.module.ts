import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionCategory } from 'src/entities/questionCategory.entity';
import { Room } from 'src/entities/room.entity';
import { RoomUser } from 'src/entities/roomUser.entity';
import { SolvedTime } from 'src/entities/solvedTime.entity';
import { TestCase } from 'src/entities/testCase.entity';
import { Tier } from 'src/entities/tier.entity';
import { User } from 'src/entities/user.entity';

const databaseModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    return {
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Category, Question, QuestionCategory, SolvedTime, Tier, User, TestCase, Room, RoomUser],
      charset: 'utf8mb4',
      synchronize: false,
    };
  },
});

@Module({
  imports: [databaseModule],
  exports: [databaseModule],
})
export class DatabaseModule {}
