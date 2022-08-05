import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// TODO: FIGURE OUT WHY PARTIAL TYPE IS NOT WORKING...
export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyPasswordDto {
  @IsNumber()
  otp: number;

  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
