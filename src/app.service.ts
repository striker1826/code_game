import { Injectable } from '@nestjs/common';

import * as assert from 'assert';

const problem = {
  description: '숫자 배열을 입력받아 정렬된 배열을 반환합니다.',
  input: {
    type: 'array',
    items: {
      type: 'number',
    },
  },
  output: {
    type: 'array',
    items: {
      type: 'number',
    },
  },
};

// 테스트 케이스
const testCases = [
  { input: 'hi', output: 'hi' },
  {
    input: [1, 5, 3, 2, 4],
    output: [1, 2, 3, 4, 5],
  },
  {
    input: [1],
    output: [1],
  },
  {
    input: [1],
    output: [1],
  },
  {
    input: [1],
    output: [1],
  },
  {
    input: [1],
    output: [1],
  },
  { input: 'hi', output: 'hi' },
];

@Injectable()
export class AppService {
  async runCode(code, input) {
    const myResult = await eval(code + `string('${input}')`);
    return myResult;
  }

  async test(code) {
    for (const testCase of testCases) {
      const output = await this.runCode(code, testCase.input);

      try {
        assert.deepStrictEqual(output, testCase.output);
        console.log('성공');
      } catch (err) {
        console.log('실패');
      }
    }
  }
}
