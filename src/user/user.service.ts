/* eslint-disable prettier/prettier */
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Address } from '../address/schemas/address.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from './schemas/tenant.schema';
import { Lessor } from './schemas/lessor.schema';
import { ApiResponseDto } from 'src/dto/response.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import * as dayjs from 'dayjs';
import { RefreshTokenService } from 'src/helpers/refreshToken';
import { GenerateTokenService } from 'src/helpers/token';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Address.name)
    private addressModel: mongoose.Model<Address>,
    @InjectModel(Tenant.name)
    private tenantModel: mongoose.Model<Tenant>,
    @InjectModel(Lessor.name)
    private lessorModel: mongoose.Model<Lessor>,

    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private generateTokenService: GenerateTokenService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  // async signup(
  //   signUpDto: SignUpDto,
  // ): Promise<ApiResponseDto<{ token: string }>> {
  //   const { username, password, email, address, role, tenant, lessor } =
  //     signUpDto;
  //   const salt = 10;
  //   const hashPassword = await bcrypt.hash(password, salt);
  //   const codeId = uuidv4();
  //   console.log('codeId: ', codeId);

  //   if (address) {
  //     const newAddress = await this.addressModel.create(address);

  //     let newTenant;
  //     let newLessor;

  //     for (let index = 0; index < role.length; index++) {
  //       const element = role[index];
  //       if (element === 'tenant') {
  //         newTenant = await this.tenantModel.create(tenant);
  //         const newUser = await this.userModel.create({
  //           username,
  //           password: hashPassword,
  //           email,
  //           role,
  //           address: newAddress,
  //           tenant: newTenant,
  //           code_id: codeId,
  //           code_expired: dayjs().add(5, 'minutes'),
  //         });
  //         if (newTenant.userId) {
  //           throw new Error('User id is already existed.');
  //         }
  //         await newTenant.updateOne({
  //           $push: {
  //             userId: newUser._id,
  //           },
  //         });

  //         const token = await this.jwtService.sign({
  //           id: newUser._id,
  //           username: newUser.email,
  //           role: newUser.role,
  //         });

  //         this.mailerService
  //           .sendMail({
  //             to: newUser.email,
  //             from: 'trieu93710@donga.edu.vn',
  //             subject: 'Activation account ✔',
  //             template: 'register',
  //             context: {
  //               name: newUser.username || newUser.email,
  //               activationCode: newUser.code_id,
  //               userId: newUser._id,
  //               uriActivation: `http://localhost:8080/user/`,
  //             },
  //           })
  //           .then(() => {})
  //           .catch(() => {});

  //         return {
  //           statusCode: 201,
  //           statusMessage: 'Register successfully',
  //           data: {
  //             token: token,
  //           },
  //         };
  //       }
  //       if (element === 'lessor') {
  //         newLessor = await this.lessorModel.create(lessor);

  //         const newUser = await this.userModel.create({
  //           username,
  //           password: hashPassword,
  //           email,
  //           role,
  //           address: newAddress,
  //           lessor: newLessor,
  //           code_id: codeId,
  //           code_expired: dayjs().add(5, 'minutes'),
  //         });

  //         const token = await this.jwtService.sign({
  //           id: newUser._id,
  //           username: newUser.email,
  //           role: newUser.role,
  //         });

  //         this.mailerService
  //           .sendMail({
  //             to: newUser.email,
  //             from: 'trieu93710@donga.edu.vn',
  //             subject: 'Activation account ✔',
  //             template: 'register',
  //             context: {
  //               name: newUser.username || newUser.email,
  //               activationCode: newUser.code_id,
  //               userId: newUser._id,
  //               uriActivation: `http://localhost:8080/user/`,
  //             },
  //           })
  //           .then(() => {})
  //           .catch(() => {});

  //         return {
  //           statusCode: 201,
  //           statusMessage: 'Register successfully',
  //           data: {
  //             token: token,
  //           },
  //         };
  //       }
  //       if (element === 'admin') {
  //         const newUser = await this.userModel.create({
  //           username,
  //           password: hashPassword,
  //           email,
  //           role,
  //           address: newAddress,
  //           code_id: codeId,
  //           code_expired: dayjs().add(5, 'minutes'),
  //         });

  //         const token = await this.jwtService.sign({
  //           id: newUser._id,
  //           username: newUser.email,
  //           role: newUser.role,
  //         });

  //         this.mailerService
  //           .sendMail({
  //             to: newUser.email,
  //             from: 'trieu93710@donga.edu.vn',
  //             subject: 'Activation account ✔',
  //             template: 'register',
  //             context: {
  //               name: newUser.username || newUser.email,
  //               activationCode: newUser.code_id,
  //               userId: newUser._id,
  //               uriActivation: `http://localhost:8080/user/`,
  //             },
  //           })
  //           .then(() => {})
  //           .catch(() => {});

  //         return {
  //           statusCode: 201,
  //           statusMessage: 'Register successfully',
  //           data: {
  //             token: token,
  //           },
  //         };
  //       }
  //     }
  //   }

  //   const newUser = await this.userModel.create({
  //     username,
  //     password: hashPassword,
  //     email,
  //     role,
  //     code_id: codeId,
  //     code_expired: dayjs().add(5, 'minutes'),
  //   });

  //   const token = await this.jwtService.sign({
  //     id: newUser._id,
  //     username: newUser.email,
  //     role: newUser.role,
  //   });

  //   // Send email to activation account
  //   this.mailerService
  //     .sendMail({
  //       to: newUser.email,
  //       from: 'trieu93710@donga.edu.vn',
  //       subject: 'Activation account ✔',
  //       template: 'register',
  //       context: {
  //         name: newUser.username || newUser.email,
  //         activationCode: newUser.code_id,
  //         userId: newUser._id,
  //         uriActivation: `http://localhost:8080/user/`,
  //       },
  //     })
  //     .then(() => {})
  //     .catch(() => {});

  //   return {
  //     statusCode: 201,
  //     statusMessage: 'Register successfully',
  //     data: {
  //       token: token,
  //     },
  //   };
  // }

  async signup(
    signUpDto: SignUpDto,
  ): Promise<ApiResponseDto<{ token: string }>> {
    const { username, password, email, address, role, tenant, lessor } =
      signUpDto;
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const codeId = uuidv4();
    console.log('codeId: ', codeId);

    // Kiểm tra người dùng đã tồn tại hay chưa
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const newAddress = address ? await this.addressModel.create(address) : null;

    // Lưu dự liệu cho user
    const newUserData: any = {
      username,
      password: hashPassword,
      email,
      address: newAddress,
      code_id: codeId,
      code_expired: dayjs().add(5, 'minutes'),
    };

    if (role.includes('tenant')) {
      const newTenant = await this.tenantModel.create(tenant);
      newUserData.role = role[0];
      newUserData.tenant = newTenant;
    } else if (role.includes('lessor')) {
      const newLessor = await this.lessorModel.create(lessor);
      console.log('newLessor: ', newLessor);
      newUserData.lessor = newLessor;
      newUserData.role = role[0];
    }

    const newUser = await this.userModel.create(newUserData);

    if (role.includes('tenant')) {
      await this.updateTenantUserId(newUser.tenant, newUser._id.toString());
    }

    const token = await this.jwtService.sign({
      id: newUser._id,
      username: newUser.email,
      role: role,
    });

    await this.sendActivationEmail(newUser);

    return {
      statusCode: 201,
      statusMessage: 'Register successfully',
      data: {
        token,
      },
    };
  }

  private async updateTenantUserId(
    tenantId: string,
    userId: string,
  ): Promise<void> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant.userId) {
      await tenant.updateOne({
        $push: { userId: userId },
      });
    } else {
      throw new Error('User id is already existed for this tenant.');
    }
  }

  private async sendActivationEmail(user: any): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'trieu93710@donga.edu.vn',
      subject: 'Activation account ✔',
      template: 'register',
      context: {
        name: user.username || user.email,
        activationCode: user.code_id,
        userId: user._id,
        uriActivation: `http://localhost:8080/user/`,
        handleActivate: 'handleActivate',
      },
    });
  }

  async activateAccount(userId: string): Promise<any> {
    try {
      // alert('Activation account')
      console.log('===>');
      const user = this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if ((await user).isActive === true) {
        return true;
      }

      const updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          isActive: true,
        },
        { new: true },
      );
      updateUser.save();
      console.log('updateUser: ', updateUser);

      return updateUser;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email.');
    }

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password.');
    }

    const token = this.generateTokenService.token(
      user._id.toString(),
      user.email,
      user.role[0],
    );

    const refresh = this.refreshTokenService.refreshToken(
      user._id.toString(),
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
  ): Promise<ApiResponseDto<{ newToken; newRefreshToken }>> {
    const { id } = this.jwtService.decode(refreshToken);
    const user = await this.userModel.findById(id);

    const email = user.email;
    const role = user.role[0];

    const token = this.generateTokenService.token(id, email, role);
    const refresh = this.refreshTokenService.refreshToken(
      id,
      email,
      role,
    );

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

  async findAll(): Promise<ApiResponseDto<User[]>> {
    const data = await this.userModel
      .find()
      .populate('tenant')
      .populate('lessor')
      .populate('address');
    if (!data) {
      throw new NotFoundException('Not found');
    }
    const roleNotAdminFiltered = data.filter(
      (item) => item.role.toString() !== 'admin',
    );
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all user successfully',
      data: roleNotAdminFiltered,
    };
  }

  async findById(id: string): Promise<ApiResponseDto<User>> {
    const data = await this.userModel
      .findById(id)
      .populate('tenant')
      .populate('lessor');
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get user successfully',
      data: data,
    };
  }

  async findUserByEmail(email: string): Promise<ApiResponseDto<User>> {
    const data = await this.userModel.findOne({ email: email });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get a user by email successfully',
      data: data,
    };
  }

  async findAllTenants(): Promise<ApiResponseDto<Tenant[]>> {
    const data = await this.tenantModel.find();
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all tenant successfully',
      data: data,
    };
  }
}
