/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { RequireEntity } from '../../requires/entities/require.entity';
import { ManagerEntity } from '../../user/entities/manager.entity';
import { PostStatusType } from '../../shared/enums/post.enum';
import { ApplicantEntity } from '../../user/entities/applicant.entity';
import { WorkType } from '../../shared/enums/work.enum';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ApplyEntity } from '../../apply/entities/apply.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ nullable: true })
  video: string;

  @Column({
    type: 'enum',
    enum: WorkType,
    array: true,
    default: [WorkType.INSTANT],
  })
  work_type: WorkType[];

  @ManyToOne(() => CompanyEntity, (comp) => comp.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company: CompanyEntity | null;

  @ManyToOne(() => CategoryEntity, (typeOfPost) => typeOfPost.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  type_of_post: CategoryEntity | null;

  @Column({
    type: 'enum',
    enum: PostStatusType,
    array: true,
    default: [PostStatusType.NOT_APPROVED],
  })
  status: PostStatusType[];

  @Column({ type: Number, default: 0, nullable: true })
  totalRating: number;

  @Column({ type: 'date', nullable: true })
  duration: Date;

  @Column({ nullable: true })
  salary: number;

  @Column({ nullable: true })
  benefit: string;

  @OneToOne(() => RequireEntity, (require) => require.post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  require: RequireEntity | null;

  @ManyToOne(() => ManagerEntity, (createBy) => createBy.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  createBy: ManagerEntity | null;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.saves, {
    nullable: true,
  })
  @JoinColumn()
  save: ApplicantEntity;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.wishlists, {
    nullable: true,
  })
  @JoinColumn()
  wishlist: ApplicantEntity;

  @OneToMany(() => ApplyEntity, (apply) => apply.post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applies: ApplyEntity[] | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
