import { TestCase } from 'src/entities/testCase.entity';
import { GradingRepository } from './grading.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestCaseDto } from './dto/input/testCase.dto';

export class GradingRepositoryImpl implements GradingRepository {
  constructor(@InjectRepository(TestCase) private readonly testCaseModel: Repository<TestCase>) {}

  async findSampleTestCaseByQuestionId(questionId: number): Promise<TestCase[]> {
    const testCases = await this.testCaseModel.find({ where: { questionId, isSample: true } });
    return testCases;
  }

  async saveTestCase({ input, output, isSample }: TestCaseDto, questionId: number): Promise<void> {
    const newTestCase = this.testCaseModel.create();
    newTestCase.input = input;
    newTestCase.output = output;
    newTestCase.isSample = isSample;
    newTestCase.questionId = questionId;
    await this.testCaseModel.save(newTestCase);
    return;
  }

  async findTestCaseByQuestionId(questionId: number): Promise<TestCase[]> {
    const testCases = await this.testCaseModel.find({ where: { questionId } });
    return testCases;
  }
}
