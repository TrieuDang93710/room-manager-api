/* eslint-disable prettier/prettier */
import { PostEntity } from 'src/posts/entities/post.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ApplyEntity } from 'src/apply/entities/apply.entity';
import { SalaryEntity } from 'src/salary/entities/salary.entity';

@Entity('applicants')
export class ApplicantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PostEntity, (post) => post.save, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  saves: PostEntity[] | null;

  @OneToMany(() => UserEntity, (user) => user.follower, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  followers: UserEntity[] | null;

  @OneToMany(() => PostEntity, (post) => post.wishlist, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  wishlists: PostEntity[] | null;

  @OneToMany(() => ApplyEntity, (apply) => apply.applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applies: ApplyEntity[] | null;

  @OneToOne(() => UserEntity, (user) => user.applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity | null;

  @OneToMany(() => SalaryEntity, (salaries) => salaries.applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  salaries: SalaryEntity[] | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
