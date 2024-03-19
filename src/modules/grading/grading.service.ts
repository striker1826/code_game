import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GradingRepository } from './grading.repository';
import { TestCaseDto } from './dto/input/testCase.dto';
import * as assert from 'assert';

@Injectable()
export class GradingService {
  constructor(@Inject(GradingRepository) private readonly gradingRepository: GradingRepository) {}

  async getTestCase(questionId: number) {
    // questionId를 이용하여 해당 questionId의 TestCase를 조회하는 로직
    const testCases = await this.gradingRepository.findSampleTestCaseByQuestionId(questionId);
    return testCases;
  }

  async createTestCase(testCaseDto: TestCaseDto, questionId: number) {
    // questionId, input, output, isSample을 이용하여 새로운 TestCase를 생성하는 로직
    await this.gradingRepository.saveTestCase(testCaseDto, questionId);
    return;
  }

  async gradingSampleTestCase({ code }, questionId: number) {
    // code, questionId를 이용하여 채점하는 로직
    const sampleTestCases = await this.gradingRepository.findSampleTestCaseByQuestionId(questionId);

    let result = [];

    sampleTestCases.forEach(async (testCase) => {
      const output = await this.runCode(code, testCase.input);
      try {
        assert.deepStrictEqual(output, testCase.output);
        result.push({ testCaseId: testCase.testCaseId, result: '성공' });
      } catch (err) {
        result.push({ testCaseId: testCase.testCaseId, result: '실패' });
      }
    });

    return result;
  }

  async runCode(code, input) {
    try {
      const output = await eval(code + `solution('${input}')`);
      return output;
    } catch (err) {
      throw new BadRequestException('코드 실행 중 오류가 발생했습니다.');
    }
  }

  async gradingTestCase({ code }, questionId: number) {
    // code, questionId를 이용하여 채점하는 로직
    const testCases = await this.gradingRepository.findTestCaseByQuestionId(questionId);
    console.log(testCases);
    let result = [];

    testCases.forEach(async (testCase) => {
      const output = await this.runCode(code, testCase.input);
      try {
        assert.deepStrictEqual(output, testCase.output);
        result.push({ testCaseId: testCase.testCaseId, result: '성공' });
      } catch (err) {
        result.push({ testCaseId: testCase.testCaseId, result: '실패' });
      }
    });

    return result;
  }
}
