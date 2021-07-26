import { User } from '../users/users.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TypeCardType {
  'KEY',
  'MOBILE',
}
@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('enum', { name: 'type', enum: TypeCardType })
  type: TypeCardType;

  @Column('integer', { name: 'card_number', nullable: true })
  cardNumber: number;

  @Column('date', {
    name: 'activation_date',
    default: () => 'now()',
  })
  activationDate: Date;

  @Column('date', {
    name: 'expiration_date',
    nullable: true,
  })
  expirationDate: Date;

  @Column('boolean', { name: 'is_active', default: () => 'true' })
  isActive: boolean;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
