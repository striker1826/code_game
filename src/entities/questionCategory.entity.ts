import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Category } from './category.entity';

@Entity({ name: 'QuestionCategory' })
export class QuestionCategory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'questionCategoryId',
    comment: 'Question Category ID',
  })
  questionCategoryId: number;

  @Column('bigint', { name: 'questionId', comment: 'Question ID' })
  questionId: number;

  @Column('bigint', { name: 'categoryId', comment: 'Category ID' })
  categoryId: number;

  // Many to one relationship
  @ManyToOne(() => Question, (question) => question.QuestionCategory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionId', referencedColumnName: 'questionId' }])
  Question: Question;

  @ManyToOne(() => Category, (category) => category.QuestionCategory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'categoryId' }])
  Category: Category;
}
