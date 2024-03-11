import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { PatchDate } from 'src/entities/patchDate.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionCategory } from 'src/entities/questionCategory.entity';
import { SolvedTime } from 'src/entities/solvedTime.entity';
import { Tier } from 'src/entities/tier.entity';
import { User } from 'src/entities/user.entity';

const databaseModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Category,
        PatchDate,
        Question,
        QuestionCategory,
        SolvedTime,
        Tier,
        User,
      ],
      charset: 'utf8mb4',
      synchronize: false,
      logging: true,
      ssl: {
        requestCert: true,
      },
    };
  },
});

@Module({
  imports: [databaseModule],
  exports: [databaseModule],
})
export class DatabaseModule {}
