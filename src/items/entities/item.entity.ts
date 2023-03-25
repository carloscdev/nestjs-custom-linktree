import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemType } from '../interfaces/item.interface';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  userId: string;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.LINK,
  })
  type: ItemType;

  @Column('text')
  title: string;

  @Column('text', {
    nullable: true,
  })
  url: string;

  @Column('text', {
    nullable: true,
  })
  image: string;

  @Column({ type: 'double precision' })
  position: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;
}
