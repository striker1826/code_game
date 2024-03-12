// 테스트 케이스
export const testCases = [
  { input: '"aaa", 3', output: 'aaaaaaaaa' },
  {
    input: '"hello", 3',
    output: 'hellohellohello',
  },
  {
    input: '"gading", 3',
    output: 'gadinggadinggading',
  },
  {
    input: '"qwektjq", 3',
    output: 'qwektjqqwektjqqwektjq',
  },
  {
    input: '"qweruio", 3',
    output: 'qweruioqweruioqweruio',
  },
  {
    input: '"vzxnm.akjqqo", 3',
    output: 'vzxnm.akjqqovzxnm.akjqqovzxnm.akjqqo',
  },
  { input: '"asdfjklqw", 3', output: 'asdfjklqwasdfjklqwasdfjklqw' },
];

export const oddAndEven = [
  { input: 3, output: '홀수입니다' },
  { input: 4, output: '짝수입니다' },
  { input: 5, output: '홀수입니다' },
  { input: 6, output: '짝수입니다' },
  { input: 7, output: '홀수입니다' },
  { input: 8, output: '짝수입니다' },
  { input: 9, output: '홀수입니다' },
  { input: 10, output: '짝수입니다' },
];
