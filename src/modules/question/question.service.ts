import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { DataSource, LimitOnUpdateNotSupportedError } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { testCases, oddAndEven } from 'src/gradingConfig/testcase.config';
import * as assert from 'assert';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(QuestionRepository)
    private readonly questionRepository: QuestionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createQuestion({ question }, categoryId: number): Promise<void> {
    // Check if category exists
    const isCategory = await this.questionRepository.findCategory(categoryId);
    if (!isCategory) throw new NotFoundException('Category not found');

    // Create question
    await this.dataSource.transaction(async (manager) => {
      const { questionId } = await this.questionRepository.createQuestion(question, manager);
      await this.questionRepository.createQuestionCategory(categoryId, questionId, manager);
    });

    return;
  }

  async getQuestion(): Promise<Question> {
    const questions = await this.questionRepository.findQuestions();

    // questions suffle -> Todo: 피셔-예이츠 셔플 로직으로 수정 필요
    questions.sort(() => Math.random() - 0.5);
    console.log(questions[0]);
    return questions[0];
  }

  async getQuestionById(questionId: number): Promise<Question> {
    const question = await this.questionRepository.findQuestionByQuestionId(questionId);
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async runCode(code, input) {
    try {
      const output = await eval(code + `solution('${input}')`);
      return output;
    } catch (err) {
      return err;
    }
  }
}
