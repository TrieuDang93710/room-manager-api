/* eslint-disable prettier/prettier */
import { PostEntity } from 'src/posts/entities/post.entity';
import {
  Column,
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
import { SalaryEntity } from 'src/salary/entities/salary.entity';
import { ResumeEntity } from 'src/resume/entities/resume.entity';
import { ApplyEntity } from 'src/apply/entities/apply.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Entity('applicants')
export class ApplicantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  hobby: string;

  @Column({ nullable: true })
  skill: string;

  @Column({ nullable: true })
  language: string;

  @OneToMany(() => PostEntity, (post) => post.save, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  saves: PostEntity[] | null;

  @OneToMany(() => CompanyEntity, (comp) => comp.applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  companies: CompanyEntity[] | null;

  @OneToMany(() => PostEntity, (post) => post.wishlist, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  wishlists: PostEntity[] | null;

  @OneToMany(() => ResumeEntity, (resume) => resume.applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resumes: ResumeEntity[] | null;

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
