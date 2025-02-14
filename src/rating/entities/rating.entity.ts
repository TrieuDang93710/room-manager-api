/* eslint-disable prettier/prettier */
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ratings')
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  star: number;

  @Column()
  comment: string;

  @ManyToOne(() => PostEntity, (post) => post.ratings, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  post: PostEntity | null;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  userId: UserEntity | null;
}
