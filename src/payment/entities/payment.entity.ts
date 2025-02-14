/* eslint-disable prettier/prettier */
import { ServicePackageEntity } from 'src/service_package/entities/service_package.entity';
import { PaymentMethod, PaymentType } from 'src/shared/enums/payment.enum';
import { ManagerEntity } from 'src/user/entities/manager.entity';
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

  @Column()
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
    enum: PaymentType,
    array: true,
    default: [PaymentType.MONTHLY],
  })
  paymentType: PaymentType[];

  @Column()
  amount: number;

  @Column()
  surcharge: number;

  @Column({ default: 0 })
  total: number;

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
