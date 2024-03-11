import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PatchDate } from './patchDate.entity';
import { Tier } from './tier.entity';
import { SolvedTime } from './solvedTime.entity';

@Entity({ name: 'User' })
export class User extends PatchDate {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'userId',
    comment: 'User ID',
  })
  @Unique(['userId'])
  userId: number;

  @Column('bigint', { name: 'tierId', comment: 'Users tier ID' })
  tierId: number;

  @Column('varchar', { name: 'nickname', comment: 'User nickname', length: 8 })
  nickname: string;

  @ManyToOne(() => Tier, (tier) => tier.User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tierId', referencedColumnName: 'tierId' }])
  Tier: Tier;

  @OneToMany(() => SolvedTime, (solvedTime) => solvedTime.User)
  SolvedTime: SolvedTime[];
}
