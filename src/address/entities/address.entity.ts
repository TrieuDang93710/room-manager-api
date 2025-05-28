/* eslint-disable prettier/prettier */
import { UserEntity } from '../../user/entities/user.entity';
import { WorkPlaceEntity } from '../../work_place/entities/work-place.entity';
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

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  national: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  village: string;

  @OneToOne(() => UserEntity, (user) => user.address, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @OneToOne(() => WorkPlaceEntity, (w_place) => w_place.address, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  work_place: WorkPlaceEntity | null;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
