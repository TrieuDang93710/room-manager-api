/* eslint-disable prettier/prettier */
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
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { ResumeStatusType } from 'src/shared/enums/resume.enum';
import { ApplyEntity } from 'src/apply/entities/apply.entity';

@Entity('resumes')
export class ResumeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  target: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cv: string;

  @Column({ nullable: true })
  hobby: string;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  education: object;

  @Column({ nullable: true })
  level: string;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  experiences: object;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  certificates: object;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  awards: object;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  expertise: object;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  skills: object;

  @Column({
    default: {},
    type: 'jsonb',
    nullable: true,
  })
  languages: object;

  @Column({
    type: 'enum',
    enum: ResumeStatusType,
    array: true,
    default: [ResumeStatusType.SUCCESS],
  })
  status: ResumeStatusType[];

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.resumes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applicant: ApplicantEntity | null;

  @OneToMany(() => ApplyEntity, (apply) => apply.resume, {
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
