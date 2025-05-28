/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';
import { ApplyStatusType } from '../../shared/enums/apply.enum';
import { ResumeEntity } from '../../resume/entities/resume.entity';
import { ApplicantEntity } from '../../user/entities/applicant.entity';

@Entity('applies')
export class ApplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  letter: object;

  @Column({
    type: 'enum',
    enum: ApplyStatusType,
    array: true,
    default: [ApplyStatusType.APPLIED],
  })
  status: ApplyStatusType[];

  @ManyToOne(() => PostEntity, (post) => post.applies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostEntity | null;

  @ManyToOne(() => ResumeEntity, (resume) => resume.applies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resume: ResumeEntity | null;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.applies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applicant: ApplicantEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
