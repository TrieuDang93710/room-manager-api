/* eslint-disable prettier/prettier */
import { CategoryEntity } from 'src/category/entities/category.entity';
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

@Entity('fields')
export class FieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @OneToMany(() => CategoryEntity, (cate) => cate.field, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cates: CategoryEntity[];

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
