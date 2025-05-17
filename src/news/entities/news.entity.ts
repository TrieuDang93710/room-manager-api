/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('newses')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true, array: true })
  image: string[];

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  contents: string;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  information: object;

  @Column({ type: 'bool', default: false })
  status: boolean;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
