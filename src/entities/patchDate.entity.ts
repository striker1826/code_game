import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'PatchDate' })
export class PatchDate {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'patchDateId',
    comment: 'Patch Date ID',
  })
  patchDateId: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    comment: '유저 가입일자',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    comment: '유저 정보 수정일자',
  })
  updatedAt: Date;
}
