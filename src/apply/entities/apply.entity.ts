/* eslint-disable prettier/prettier */
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
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplyStatusType } from 'src/shared/enums/apply.enum';
import { ResumeEntity } from 'src/resume/entities/resume.entity';

@Entity('applies')
export class ApplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  description: string;

  @Column({
    type: 'enum',
    enum: ApplyStatusType,
    array: true,
    default: [ApplyStatusType.APPLIED],
  })
  status: ApplyStatusType[];

  @OneToOne(() => ResumeEntity, (resume) => resume.apply, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resume: ResumeEntity | null;

  @ManyToOne(() => PostEntity, (post) => post.applies, {
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
