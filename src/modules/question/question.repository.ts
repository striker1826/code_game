import { Category } from 'src/entities/category.entity';
import { Question } from 'src/entities/question.entity';
import { EntityManager } from 'typeorm';

export interface QuestionRepository {
  // Find
  findCategory(categoryId: number): Promise<Category>;
  findQuestions(): Promise<Question[]>;

  // Create
  createQuestion(question: string, manager: EntityManager): Promise<Question>;
  createQuestionCategory(categoryId: number, questionId: number, manager: EntityManager): Promise<void>;
}

export const QuestionRepository = Symbol('QuestionRepository');
