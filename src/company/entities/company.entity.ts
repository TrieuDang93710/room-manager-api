/* eslint-disable prettier/prettier */

import { PostEntity } from 'src/posts/entities/post.entity';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ nullable: true })
  video: string;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  contact: object;

  @OneToOne(() => WorkPlaceEntity, (w_place) => w_place.company, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  work_place: WorkPlaceEntity | null;

  @OneToMany(() => PostEntity, (post) => post.company, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  posts: PostEntity[] | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
