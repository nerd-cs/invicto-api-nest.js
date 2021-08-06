import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.model';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'value', unique: true })
  value: string;

  @Column('timestamp with time zone', {
    name: 'valid_through',
    default: () => 'now()',
  })
  validThrough: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
