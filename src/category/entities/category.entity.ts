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

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @OneToMany(() => PostEntity, (post) => post.type_of_post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  posts: PostEntity[];

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
