import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PatchDate } from './patchDate.entity';
import { QuestionCategory } from './questionCategory.entity';
import { SolvedTime } from './solvedTime.entity';
import { TestCase } from './testCase.entity';

@Entity({ name: 'Question' })
export class Question extends PatchDate {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'questionId',
    comment: 'Question ID',
  })
  @Unique(['questionId'])
  questionId: number;

  @Column('varchar', { name: 'question', comment: 'Question' })
  question: string;

  @Column('varchar', { name: 'format', comment: '문제에 대한 답변 기본 형식', nullable: true })
  format: string;

  @OneToMany(() => QuestionCategory, (questionCategory) => questionCategory.Question)
  QuestionCategory: QuestionCategory[];

  @Column('varchar', { name: 'time', comment: '문제 풀이 시간' })
  time: string;

  @OneToMany(() => SolvedTime, (solvedTime) => solvedTime.Question)
  SolvedTime: SolvedTime[];

  @OneToMany(() => TestCase, (TestCase) => TestCase.Question)
  TestCases: TestCase[];
}
