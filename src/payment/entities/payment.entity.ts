/* eslint-disable prettier/prettier */
import { ServicePackageEntity } from '../../service_package/entities/service_package.entity';
import { PaymentMethod, PaymentStatus } from '../../shared/enums/payment.enum';
import { ManagerEntity } from '../../user/entities/manager.entity';
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

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  paymentDate: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    array: true,
    default: [PaymentMethod.CASH_PAYMENT],
  })
  paymentMethod: PaymentMethod[];

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    array: true,
    default: [PaymentStatus.NOT_SUCCEED],
  })
  status: PaymentStatus[];

  @Column({ nullable: true })
  cardType: string;

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  surcharge: number;

  @Column({ default: 0 })
  total: string;

  @ManyToOne(() => ServicePackageEntity, (pck) => pck.payments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  package: ServicePackageEntity | null;

  @ManyToOne(() => ManagerEntity, (buyer) => buyer.account_pay, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  buyer: ManagerEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
