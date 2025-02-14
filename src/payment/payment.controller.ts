/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  async getPayments() {
    return this.paymentService.findAll();
  }

  @Post('/contract/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async createPayment(
    @Body()
    createPaymentDto: CreatePaymentDto,
    @Req()
    req: any,
    @Param('id')
    id: number,
  ) {
    return this.paymentService.create(createPaymentDto, req.user, id);
  }

  @Get('/:id')
  async getPaymentById(
    @Param('id')
    id: number,
  ) {
    return this.paymentService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updatePaymentById(
    @Param('id')
    id: number,
    @Body()
    updatePaymentDto: any,
  ) {
    return this.paymentService.updateById(id, updatePaymentDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deletePaymentById(
    @Param('id')
    id: number,
  ) {
    return this.paymentService.deleteById(id);
  }
}
