/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Room } from 'src/room/schemas/room.schema';
import { Tenant } from 'src/user/schemas/tenant.schema';
import { Lessor } from 'src/user/schemas/lessor.schema';
import { Payment } from './payment/schemas/payment.schema';
import { CreateContractDto } from './dto/create.dto';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private contractMocel: mongoose.Model<Contract>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Room.name)
    private roomModel: mongoose.Model<Room>,
    @InjectModel(Tenant.name)
    private tenantModel: mongoose.Model<Tenant>,
    @InjectModel(Lessor.name)
    private lessorModel: mongoose.Model<Lessor>,
    @InjectModel(Payment.name)
    private paymentModel: mongoose.Model<Payment>,
  ) {}

  async create(
    createContractDto: CreateContractDto,
    user: User,
  ): Promise<ApiResponseDto<Contract>> {
    const { name, contract, people, deposit, tenantBy, pay, roomId } =
      createContractDto;

    // const data = await Object.assign(contract, user)
    const findUser = await this.userModel.findById(user);
    const findLessor = await this.lessorModel.findById(findUser.lessor);

    if (!tenantBy) {
      throw new NotFoundException('Not found tenant of id.');
    }

    const findTenant = await this.tenantModel.findById(tenantBy);

    const findTenantInfor = await this.userModel.findById(findTenant.userId);

    if (!pay) {
      throw new NotFoundException('Not found pay method.');
    }

    const newPay = await this.paymentModel.create(pay);

    const res = await this.contractMocel.create({
      name,
      contract,
      people,
      phone: findTenantInfor.phone,
      deposit,
      pay: newPay,
      tenantBy: findTenantInfor._id,
      roomId,
      createBy: findUser._id,
    });

    const alreadyContract = await findTenant.historys.find(
      (c_id) => c_id === res._id,
    );

    if (!alreadyContract) {
      await findTenant.updateOne({
        $push: {
          historys: res._id,
        },
      });
    }

    console.log(
      findUser,
      findLessor,
      findTenant,
      createContractDto,
      newPay,
      res,
    );
    return {
      statusCode: 201,
      statusMessage: 'Create new contract successfully',
      data: res,
    };
  }

  async findAll(): Promise<ApiResponseDto<Contract[]>> {
    const data = await this.contractMocel.find();
    // .populate('tenantBy')
    // .populate('roomId')
    // .populate('createBy')
    // .populate('pay')
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all contract successfully',
      data: data,
    };
  }

  async findById(id: string): Promise<ApiResponseDto<Contract>> {
    const data = await this.contractMocel.findById(id);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get a contract successfully',
      data: data,
    };
  }

  async updateById(id: string, contract: Contract): Promise<Contract> {
    return this.contractMocel.findByIdAndUpdate(id, contract, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<Contract> {
    return this.contractMocel.findByIdAndUpdate(id);
  }
}
