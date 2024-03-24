import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomUser } from './roomUser.entity';

@Entity({ name: 'Room' })
export class Room {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'roomId', comment: '방 아이디' })
  roomId: number;

  @Column('varchar', { name: 'roomname', comment: '방 이름' })
  roomname: string;

  @Column('int', { name: 'count', comment: '방에 있는 사람의 수' })
  count: number;

  @Column('int', { name: 'ready', comment: '준비한 사람의 수' })
  ready: number;

  @Column('boolean', { name: 'isReady', comment: '준비 상태', nullable: true })
  isReady: boolean;

  @OneToMany(() => RoomUser, (RoomUser) => RoomUser.Room)
  RoomUser: RoomUser[];
}
