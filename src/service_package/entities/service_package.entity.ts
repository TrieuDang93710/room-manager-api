/* eslint-disable prettier/prettier */
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { ManagerEntity } from '../../user/entities/manager.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('service_packages')
export class ServicePackageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  price: number;

  @Column({ default: 5 })
  news_quantity: number;

  @OneToMany(() => PaymentEntity, (pay) => pay.package, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  payments: PaymentEntity[] | null;

  @ManyToOne(() => ManagerEntity, (manager) => manager.packages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  manager: ManagerEntity | null;

  @Column({ type: 'bool', default: false })
  status: boolean;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
