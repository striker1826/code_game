import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class PatchDate {
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
