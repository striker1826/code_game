import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionCategory } from './questionCategory.entity';

@Entity({ name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'categoryId',
    comment: 'Category ID',
  })
  categoryId: number;

  @Column('varchar', { name: 'category', comment: 'Category name', length: 10 })
  category: string;

  @OneToMany(() => QuestionCategory, (questionCategory) => questionCategory.Category)
  QuestionCategory: QuestionCategory[];
}
