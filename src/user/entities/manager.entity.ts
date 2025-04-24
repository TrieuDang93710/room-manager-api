/* eslint-disable prettier/prettier */
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
import { PostEntity } from 'src/posts/entities/post.entity';
import { ServicePackageEntity } from 'src/service_package/entities/service_package.entity';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Entity('managers')
export class ManagerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: [],
    type: 'jsonb',
    array: true,
    nullable: true,
  })
  social: { key: string; value: string }[];

  @Column({ default: 5 })
  news: number;

  @OneToOne(() => UserEntity, (user) => user.manager, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity | null;

  @OneToMany(() => PostEntity, (posts) => posts.createBy, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  posts: PostEntity[] | null;

  @OneToMany(() => ServicePackageEntity, (pck) => pck.manager, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  packages: ServicePackageEntity[] | null;

  @OneToOne(() => CompanyEntity, (company) => company.manager, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company: CompanyEntity | null;

  @OneToMany(() => PaymentEntity, (pay) => pay.buyer, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account_pay: PaymentEntity[] | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
