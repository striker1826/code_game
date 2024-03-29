import { Body, Controller, Get, Param, Post, Req, Session } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from 'src/entities/question.entity';
import { Request } from 'express';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/:categoryId')
  async createQuestion(@Body() question: { question: string }, @Param('categoryId') categoryId: number): Promise<void> {
    await this.questionService.createQuestion(question, categoryId);
    return;
  }

  @Get()
  async getQuestion(): Promise<Question> {
    const question = await this.questionService.getQuestion();
    return question;
  }

  @Get('/:questionId')
  async getQuestionById(@Param('questionId') questionId: number): Promise<Question> {
    const question = await this.questionService.getQuestionById(questionId);
    return question;
  }
}
