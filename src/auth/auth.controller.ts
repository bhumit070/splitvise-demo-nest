import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PRODUCTION_NODE_ENV } from 'src/constants';

import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  VerifyPasswordDto,
} from './dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupData: CreateUserDto) {
    return this.authService.signup(signupData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as CreateUserDto & { _id: string };
    const userInfo = this.authService.login(user);
    res.cookie('access_token', userInfo.access_token, {
      secure: process.env.NODE_ENV === PRODUCTION_NODE_ENV,
      httpOnly: true,
    });
    return userInfo;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    return req.user;
  }

  @Post('/forgot-password-otp')
  async forgotPasswordOtp(@Body() data: ForgotPasswordDto) {
    await this.authService.forgotPasswordOtp(data);
    return {
      message: 'OTP sent to your email',
    };
  }

  @Post('/verify-forgot-password')
  async verifyForgotPassword(@Body() data: VerifyPasswordDto) {
    await this.authService.verifyForgotPasswordOtp(data);
    return {
      message: 'Password changed successfully',
    };
  }
}
