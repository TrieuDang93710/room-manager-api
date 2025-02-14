/* eslint-disable prettier/prettier */
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { ApplyStatusType } from 'src/shared/enums/apply.enum';

@Entity('applies')
export class ApplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  apply: string;

  @Column({
    type: 'enum',
    enum: ApplyStatusType,
    array: true,
    default: [ApplyStatusType.NOT_APPROVED],
  })
  status: ApplyStatusType[];

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.applies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applicant: ApplicantEntity | null;

  @OneToOne(() => PostEntity, (post) => post.applies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
