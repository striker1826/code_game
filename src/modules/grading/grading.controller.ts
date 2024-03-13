import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GradingService } from './grading.service';
import { TestCaseDto } from './dto/input/testCase.dto';

@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Get('/sample/:questionId')
  async getSampleTestCase(questionId: number) {
    const sampleTestCase = await this.gradingService.getTestCase(questionId);
    return sampleTestCase;
  }

  // @Post('/:questionId')
  // async createTestCase(@Body() testCaseDto: TestCaseDto, @Param('questionId') questionId: number) {
  //   await this.gradingService.createTestCase(testCaseDto, questionId);
  //   return;
  // }

  @Post('/run/sample/:questionId')
  async gradingSampleTestCase(@Body() code, @Param('questionId') questionId: number) {
    const result = await this.gradingService.gradingSampleTestCase(code, questionId);
    return result;
  }

  @Post('/run/:questionId')
  async gradingTestCase(@Body() code, @Param('questionId') questionId: number) {
    const result = await this.gradingService.gradingTestCase(code, questionId);
    return result;
  }
}
