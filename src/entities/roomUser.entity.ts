import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatchDate } from './patchDate.entity';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity('RoomUser')
export class RoomUser extends PatchDate {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'roomUserId', comment: '방에 있는 유저 아이디' })
  roomUserId: number;

  @Column('bigint', { name: 'roomId', comment: '방 아이디' })
  roomId: number;

  @Column('bigint', { name: 'userId', comment: '유저 아이디' })
  userId: number;

  @Column('varchar', { name: 'key', comment: '어떤 루트로 연동했는지' })
  key: string;

  @ManyToOne(() => User, (User) => User.RoomUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  User: User;

  @ManyToOne(() => Room, (Room) => Room.RoomUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomId', referencedColumnName: 'roomId' }])
  Room: Room;
}
