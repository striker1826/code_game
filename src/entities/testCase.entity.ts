import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatchDate } from './patchDate.entity';
import { Question } from './question.entity';

@Entity({ name: 'Test_Case' })
export class TestCase extends PatchDate {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'testCaseId', comment: '테스트 케이스 아이디' })
  testCaseId: number;

  @Column('bigint', { name: 'questionId', comment: '문제 아이디' })
  questionId: number;

  @Column('boolean', { name: 'isSample', comment: '샘플 테스트 케이스 여부' })
  isSample: boolean;

  @Column({ type: 'varchar', name: 'input', comment: '입력값' })
  input: string;

  @Column({ type: 'varchar', name: 'output', comment: '출력값' })
  output: string;

  @Column({ type: 'varchar', name: 'outputType', comment: '출력값의 타입', nullable: true })
  outputType: string;

  @ManyToOne(() => Question, (question) => question.TestCases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionId', referencedColumnName: 'questionId' }])
  Question: Question;
}
