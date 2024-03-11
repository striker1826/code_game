import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from 'src/entities/question.entity';

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

  @Post('/grading/:questionId')
  async grading(@Param('questionId') questionId: number, @Body() code: { code: string }) {
    const result = await this.questionService.grading(questionId, code);
    return result;
  }
}
