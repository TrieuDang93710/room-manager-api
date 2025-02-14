/* eslint-disable prettier/prettier */
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';
export class SignUpDto {
  @IsNotEmpty()
  @IsString({ message: 'number of letter is not less 3 letter' })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'password must be more than 6 letter' })
  readonly password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  readonly role: Role[];
}
