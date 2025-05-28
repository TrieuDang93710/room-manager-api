/* eslint-disable prettier/prettier */
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  Timestamp,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.senderMessages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  sender: UserEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.receiverMessages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  receiver: UserEntity | null;

  @Column()
  text: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
