/* eslint-disable prettier/prettier */
import { PostEntity } from '../../posts/entities/post.entity';
import { GenderType } from '../../shared/enums/gender.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('requires')
export class RequireEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: GenderType,
    array: true,
    default: [GenderType.NULL],
  })
  gender: GenderType[];

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  experience: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ nullable: true})
  level: string;

  @Column({ nullable: true})
  education: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  skill: string;

  @Column({ nullable: true })
  time: string;

  @OneToOne(() => PostEntity, (post) => post.require, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
