import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from './question.repository';
import { Question } from 'src/entities/question.entity';
import { EntityManager, Repository } from 'typeorm';
import { QuestionCategory } from 'src/entities/questionCategory.entity';
import { Category } from 'src/entities/category.entity';

export class QuestionRepositoryImpl implements QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionModel: Repository<Question>,
    @InjectRepository(QuestionCategory)
    private readonly questionCategoryModel: Repository<QuestionCategory>,
    @InjectRepository(Category)
    private readonly categoryModel: Repository<Category>,
  ) {}

  async createQuestion(question: string, manager: EntityManager): Promise<Question> {
    const newQuestion = manager.getRepository(Question).create();
    newQuestion.question = question;
    const createdQuestion = await manager.getRepository(Question).save(newQuestion);
    return createdQuestion;
  }

  async createQuestionCategory(categoryId: number, questionId: number, manager: EntityManager): Promise<void> {
    const newQuestionCategory = manager.getRepository(QuestionCategory).create();
    newQuestionCategory.categoryId = categoryId;
    newQuestionCategory.questionId = questionId;
    await manager.getRepository(QuestionCategory).save(newQuestionCategory);
    return;
  }

  async findCategory(categoryId: number): Promise<Category> {
    const category = await this.categoryModel.findOne({ where: { categoryId } });
    return category;
  }

  async findQuestions(): Promise<Question[]> {
    const question = await this.questionModel.find();
    return question;
  }

  async findQuestionByQuestionId(questionId: number): Promise<Question> {
    const question = await this.questionModel.findOne({ where: { questionId } });
    return question;
  }
}
