/* eslint-disable prettier/prettier */

import { PostEntity } from '../../posts/entities/post.entity';
import { FieldStatusType } from '../../shared/enums/field.enum';
import { ApplicantEntity } from '../../user/entities/applicant.entity';
import { ManagerEntity } from '../../user/entities/manager.entity';
import { WorkPlaceEntity } from '../../work_place/entities/work-place.entity';
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

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ nullable: true })
  video: string;

  @Column({ nullable: true, default: 5 })
  scale: number;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  information: object;

  @Column({
    type: 'enum',
    enum: FieldStatusType,
    array: true,
    default: [FieldStatusType.NOT_APPROVED],
  })
  status: FieldStatusType[];

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

  @OneToOne(() => ManagerEntity, (manager) => manager.company, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  manager: ManagerEntity | null;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.companies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applicant: ApplicantEntity[] | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
