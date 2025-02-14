/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenService } from 'src/helpers/token';
import { RefreshTokenService } from 'src/helpers/refreshToken';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from 'src/user/dto/forgot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from 'src/user/dto/signin.dto';
import { AddressEntity } from 'src/address/entities/address.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,

    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,

    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,

    private jwtService: JwtService,
    private generateTokenService: GenerateTokenService,
    private refreshTokenService: RefreshTokenService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(signUpDto: any): Promise<ApiResponseDto<any>> {
    const { username, password, email, address, role } = signUpDto;

    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const codeId = uuidv4();

    // Kiểm tra người dùng đã tồn tại hay chưa
    const existedUser = await this.usersRepository.findOneBy({ email: email });

    if (existedUser) {
      throw new BadRequestException('User already exists with this email.');
    }

    let newAddress: any;

    if (!address) {
      newAddress = this.addressRepository.create();
      await this.addressRepository.save(newAddress);
    }

    newAddress = this.addressRepository.create(address);
    await this.addressRepository.save(newAddress);

    const newUserData: any = {
      username,
      password: hashPassword,
      email,
      address: newAddress,
      code_id: codeId,
      code_expired: dayjs().add(5, 'minutes'),
    };

    if (!role) {
      const newTenant = this.applicantRepository.create(null);
      await this.applicantRepository.save(newTenant);
      newUserData.tenant = newTenant;
    } else {
      if (role[0] === 'admin') {
        newUserData.role = role;
      } else {
        const newManager = this.managerRepository.create(null);
        await this.managerRepository.save(newManager);
        newUserData.role = role;
        newUserData.manager = newManager;
      }
    }

    const newUser = this.usersRepository.create(newUserData);
    const user: any = await this.usersRepository.save(newUser);
    console.log('user: ', user);

    // Update user into tenant
    if (user.role && user.role[0] === 'user' && user.tenant) {
      await this.updateTenantUserId(user.tenant.id, user.id);
    }

    // Update user into manager
    if (user.role && user.role[0] === 'manager' && user.manager) {
      await this.updateManagerUserId(user.manager.id, user.id);
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.email,
      role: role ?? user.role[0],
    });

    console.log('token: ', token);
    // await this.sendActivationEmail(newUser);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Sign up successful',
      data: { token, user },
    };
  }

  async activateAccount(userId: number): Promise<any> {
    console.log('===>');
    const user: any = this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive === true) {
      return true;
    }

    const updateUser = await this.usersRepository.update(userId, {
      active: true,
    });

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Account activation successful',
      data: updateUser,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email.');
    }

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password.');
    }

    const token = this.generateTokenService.token(
      user.id,
      user.email,
      user.role[0],
    );

    const refresh = this.refreshTokenService.refreshToken(
      user.id,
      user.email,
      user.role[0],
    );

    const data = {
      token: (await token).token,
      refreshToken: (await refresh).refreshToken,
    };

    console.log('data: ', data);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Login successfully',
      data: data,
    };
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<ApiResponseDto<{ newToken: any; newRefreshToken: any }>> {
    const { id, username, role } = this.jwtService.decode(refreshToken);

    const email = username;

    const token = this.generateTokenService.token(id, email, role);
    const refresh = this.refreshTokenService.refreshToken(id, email, role);

    const data = {
      newToken: (await token).token,
      newRefreshToken: (await refresh).refreshToken,
    };

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Refresh token successful',
      data: data,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<
    ApiResponseDto<{
      email: string;
      newPassword: string;
      hashNewPassword: string;
    }>
  > {
    const salt = 10;
    const hashPassword = await bcrypt.hash(forgotPasswordDto.password, salt);

    const user = await this.usersRepository.findOne({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Not found user');
    }

    await this.usersRepository.update(user.id, { password: hashPassword });

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Create new password',
      data: {
        email: forgotPasswordDto.email,
        newPassword: forgotPasswordDto.password,
        hashNewPassword: hashPassword,
      },
    };
  }

  private async updateTenantUserId(
    tenantId: number,
    userId: number,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const tenant: ApplicantEntity = await this.applicantRepository.findOne({
      where: {
        id: tenantId,
      },
    });
    if (tenant && !tenant.user) {
      tenant.user = user;
      await this.applicantRepository.save(tenant);
    } else {
      throw new Error('User id is already existed for this tenants.');
    }
  }

  private async updateManagerUserId(
    managerId: number,
    userId: number,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const manager: ManagerEntity = await this.managerRepository.findOne({
      where: {
        id: managerId,
      },
    });

    if (manager && !manager.user) {
      manager.user = user;
      await this.managerRepository.save(manager);
    } else {
      throw new Error('User id is already existed for this managers.');
    }
  }
}
