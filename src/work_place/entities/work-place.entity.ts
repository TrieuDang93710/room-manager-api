/* eslint-disable prettier/prettier */
import { AddressEntity } from '../../address/entities/address.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('work_places')
export class WorkPlaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  coordinate: string;

  @Column({ nullable: true })
  latitude: string;

  @OneToOne(() => AddressEntity, (address) => address.work_place, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity | null;

  @OneToOne(() => CompanyEntity, (comp) => comp.work_place, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company: CompanyEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
