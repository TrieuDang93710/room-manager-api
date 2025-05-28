/* eslint-disable prettier/prettier */
import { FieldEntity } from '../../field/entities/field.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => FieldEntity, (field) => field.cates, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  field: FieldEntity | null;

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
