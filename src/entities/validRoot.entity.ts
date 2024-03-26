import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ValidRoot')
export class ValidRoot {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'validRootId', comment: '유효 루트 아이디' })
  validRootId: number;

  @Column('varchar', { name: 'root', comment: '루트' })
  root: string;

  @Column('int', { name: 'roomId', comment: '방 아이디' })
  roomId: number;

  @Column('int', { name: 'userId', comment: '유저 아이디' })
  userId: number;
}
