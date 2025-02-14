/* eslint-disable prettier/prettier */
import { PostEntity } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('work_places')
export class WorkPlaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  coordinate: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ nullable: true })
  video: string;

  @OneToMany(() => PostEntity, (post) => post.work_place, {
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
