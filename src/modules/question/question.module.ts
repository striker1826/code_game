import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from 'src/entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRepository } from './question.repository';
import { QuestionRepositoryImpl } from './question.repositoryImpl';
import { QuestionCategory } from 'src/entities/questionCategory.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionCategory, Category])],
  controllers: [QuestionController],
  providers: [QuestionService, { provide: QuestionRepository, useClass: QuestionRepositoryImpl }],
})
export class QuestionModule {}
