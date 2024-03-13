import { TestCase } from 'src/entities/testCase.entity';
import { TestCaseDto } from './dto/input/testCase.dto';

export interface GradingRepository {
  // findMethod
  findSampleTestCaseByQuestionId(questionId: number): Promise<TestCase[]>;
  findTestCaseByQuestionId(questionId: number): Promise<TestCase[]>;

  // saveMethod
  saveTestCase(testCase: TestCaseDto, questionId: number): Promise<void>;
}

export const GradingRepository = Symbol('GradingRepository');
