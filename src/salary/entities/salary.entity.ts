/* eslint-disable prettier/prettier */
import { ApplicantEntity } from '../../user/entities/applicant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('salaries')
export class SalaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0, nullable: true })
  salary: number;

  @Column({ default: 0, nullable: true })
  loss_cost: number;

  @Column({ default: 0, nullable: true })
  salary_totals: number;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.salaries, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  applicant: ApplicantEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
