/* eslint-disable prettier/prettier */
import { AddressEntity } from 'src/address/entities/address.entity';
import { AccountType } from 'src/shared/enums/account-type.enum';
import { Role } from 'src/shared/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { ManagerEntity } from './manager.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
import { ApplicantEntity } from './applicant.entity';
import { GenderType } from 'src/shared/enums/gender.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_user_id' })
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true, type: 'date' })
  date_of_birth: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: Boolean, default: false })
  block: boolean;

  @Column({
    type: 'enum',
    enum: AccountType,
    array: true,
    default: [AccountType.LOCAL],
  })
  account_type: AccountType[];

  @Column({ type: Boolean, default: false })
  active: boolean;

  @Column({ nullable: true })
  code_id: string;

  @Column({ nullable: true })
  code_expired: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.APPLICANT] })
  role: Role[];

  @Column({ type: 'enum', enum: Role, array: true, default: [GenderType.NULL] })
  gender: GenderType[];

  @OneToOne(() => AddressEntity, (address) => address.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity | null;

  @OneToOne(() => ApplicantEntity, (applicant) => applicant.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  applicant: ApplicantEntity | null;

  @OneToOne(() => ManagerEntity, (manager) => manager.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  manager: ManagerEntity | null;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  follower: ApplicantEntity | null;

  @OneToMany(() => MessageEntity, (message) => message.receiver, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  receiverMessages: MessageEntity[] | null;

  @OneToMany(() => MessageEntity, (message) => message.sender, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  senderMessages: MessageEntity[] | null;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
