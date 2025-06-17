/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponseDto } from '../dto/response.dto';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenService } from '../helpers/token';
import { RefreshTokenService } from '../helpers/refreshToken';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from '../user/dto/forgot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from '../user/dto/signin.dto';
import { AddressEntity } from '../address/entities/address.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';
import { ManagerEntity } from '../user/entities/manager.entity';
import { TimestampConvert } from '../helpers/convert';
import { UserService } from '../user/user.service';

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

    private readonly jwtService: JwtService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: any): Promise<ApiResponseDto<any>> {
    const { username, password, email, address, role } = signUpDto;

    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const codeId = uuidv4();
    // const date = dayjs();

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

    if (!role || role[0] === 'applicant') {
      const newApplicant = this.applicantRepository.create(null);
      await this.applicantRepository.save(newApplicant);
      newUserData.applicant = newApplicant;
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
    if (user.role && user.role[0] === 'applicant' && user.applicant) {
      await this.updateApplicantUserId(user.applicant.id, user.id);
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
      message: 'Sign up successful',
      data: { token, user },
    };
  }

  async activateAccount(userId: number, codeId: string): Promise<any> {
    console.log('===>');
    if (!codeId) {
      throw new NotFoundException('Bad request');
    }
    console.log('object: ', codeId);
    const user: any = await this.usersRepository.findOne({
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
      message: 'Account activation successful',
      data: updateUser,
    };
  }

  async signIn(signInDto: SignInDto): Promise<ApiResponseDto<any>> {
    const { email, password } = signInDto;

    // const user = await this.usersRepository.findOne({
    //   where: { email: email },
    // });
    let user: any;
    await this.userService
      .findUserByEmail(email)
      .then((result) => {
        user = result.data;
        // console.log('user: ', user);
      })
      .catch((error) => {
        console.log('error: ', error);
      });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email.');
    }

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password.');
    }

    if (!user.token && !user.refresh_token) {
      // let data: { token: any; refreshToken: any };

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

      // const data = {
      //   token: (await token).token,
      //   refreshToken: (await refresh).refreshToken,
      // };

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Login successfully',
        data: {
          token: (await token).token,
          refreshToken: (await refresh).refreshToken,
        },
      };
    }

    const decodeToken = this.jwtService.decode(user.token);
    const decodeRefreshToken = this.jwtService.decode(user.refresh_token);
    const get_time = new Date().getTime();
    const datetime = Math.floor(get_time / 1000);

    const token_time_exp = decodeToken.exp - decodeToken.iat;
    const refresh_token_time_exp =
      decodeRefreshToken.exp - decodeRefreshToken.iat;
    const realtime = datetime - decodeToken.iat;

    if (user.token && realtime <= token_time_exp) {
      // data = {
      //   token: user.token,
      //   refreshToken: user.refresh_token,
      // };
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Login successfully',
        data: {
          token: user.token,
          refreshToken: user.refresh_token,
        },
      };
    }

    if (
      user.refresh_token &&
      TimestampConvert(realtime) < TimestampConvert(refresh_token_time_exp) - 1
    ) {
      // data = {
      //   token: user.token,
      //   refreshToken: user.refresh_token,
      // };
      return {
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        message: 'Warm !!!. Need to refresh token to improve quality',
        data: {
          refreshToken: user.refresh_token,
        },
      };
    }

    // return {
    //   statusCode: HttpStatus.CREATED,
    //   message: 'Login successfully',
    //   data: data,
    // };
  }

  async verifyRefreshToken(refreshToken: any): Promise<ApiResponseDto<any>> {
    const { id, iat, exp } = this.jwtService.decode(refreshToken.refreshToken);
    console.log(id);

    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('Not found user');
    }

    const email = user.email;
    const role = user.role[0];

    const token = this.generateTokenService.token(user.id, email, role);

    let refresh: Promise<{ refreshToken: string }>;

    const refresh_token_time_exp = exp - iat;
    const get_time = new Date().getTime();
    const datetime = Math.floor(get_time / 1000);
    const realtime = datetime - iat;

    if (
      refreshToken &&
      TimestampConvert(realtime) >= TimestampConvert(refresh_token_time_exp) - 1
    ) {
      refresh = this.refreshTokenService.refreshToken(user.id, email, role);
      return {
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        message: 'Warm !!!. Need to refresh token to improve quality',
      };
    }

    // const data = {
    //   newToken: (await token).token,
    //   newRefreshToken: (await refresh).refreshToken,
    // };

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Refresh token successful',
      data: { token, refresh },
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
      message: 'Create new password',
      data: {
        email: forgotPasswordDto.email,
        newPassword: forgotPasswordDto.password,
        hashNewPassword: hashPassword,
      },
    };
  }

  private async updateApplicantUserId(
    applicantId: number,
    userId: number,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const applicant: ApplicantEntity = await this.applicantRepository.findOne({
      where: {
        id: applicantId,
      },
    });
    if (applicant && !applicant.user) {
      applicant.user = user;
      await this.applicantRepository.save(applicant);
    } else {
      throw new Error('User id is already existed for this applicants.');
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

  async sendActivationEmail(user: any): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'trieu93710@donga.edu.vn',
      subject: 'Activation account ✔',
      template: 'register',
      context: {
        name: user.username || user.email,
        activationCode: user.code_id,
        userId: user.id,
        uriActivation: `http://localhost:8080/user/`,
        handleActivate: 'handleActivate',
      },
    });
  }
}
