import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PatchDate } from './patchDate.entity';
import { QuestionCategory } from './questionCategory.entity';
import { SolvedTime } from './solvedTime.entity';

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

  @OneToMany(
    () => QuestionCategory,
    (questionCategory) => questionCategory.Question,
  )
  QuestionCategory: QuestionCategory[];

  @OneToMany(() => SolvedTime, (solvedTime) => solvedTime.Question)
  SolvedTime: SolvedTime[];
}
