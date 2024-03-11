import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity({ name: 'SolvedTime' })
export class SolvedTime {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'solvedTimeId',
    comment: 'Solved Time ID',
  })
  solvedTimeId: number;

  @Column('bigint', { name: 'userId', comment: 'User ID' })
  userId: number;

  @Column('bigint', { name: 'questionId', comment: 'Question ID' })
  questionId: number;

  @Column('varchar', { name: 'solvedTime', comment: 'Solved Time', length: 10 })
  solvedTime: string;

  @ManyToOne(() => User, (user) => user.SolvedTime, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  User: User;

  @ManyToOne(() => Question, (question) => question.SolvedTime, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionId', referencedColumnName: 'questionId' }])
  Question: Question;
}
