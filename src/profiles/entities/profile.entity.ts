import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    nullable: true,
  })
  banner: string;

  @Column('text', {
    nullable: true,
  })
  image: string;

  @Column('text', {
    nullable: true,
  })
  favicon: string;

  @Column('text', {
    default: '#ffffff',
  })
  bgColor: string;

  @Column('text', {
    default: '#383838',
  })
  textColor: string;

  @Column('text', {
    default: '#f4f4f4',
  })
  itemColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
