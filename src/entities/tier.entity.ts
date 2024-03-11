import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Tier' })
export class Tier {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'tierId',
    comment: 'Tier ID',
  })
  tierId: number;

  @Column('varchar', { name: 'tier', comment: 'Tiers name', length: 10 })
  tier: string;

  @OneToMany(() => User, (user) => user.Tier)
  User: User[];
}
