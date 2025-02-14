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
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ApplyEntity } from 'src/apply/entities/apply.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import { RequireEntity } from 'src/requires/entities/require.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { PostStatusType } from 'src/shared/enums/post.enum';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import { WorkType } from 'src/shared/enums/work.enum';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @ManyToOne(() => WorkPlaceEntity, (work_place) => work_place.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  work_place: WorkPlaceEntity | null;

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

  @OneToMany(() => RatingEntity, (rating) => rating.post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  ratings: RatingEntity[] | null;

  @Column({ type: Number, default: 0, nullable: true })
  totalRating: number;

  @Column({ type: 'date', nullable: true })
  duration: Date;

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
