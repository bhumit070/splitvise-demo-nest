import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from 'src/mongodb/models/user.model';
import { UsersService } from 'src/users/users.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  VerifyPasswordDto,
} from './dtos/user.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PRODUCTION_NODE_ENV } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private UserModel: Model<UserDocument>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({ username });

    if (!user) {
      return null;
    }

    const isValidPassword = compareSync(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async signup(user: CreateUserDto) {
    return await this.UserModel.create(user);
  }

  login(user) {
    const jwtPayload = {
      username: user.name,
      _id: user._id,
    };
    return {
      user,
      access_token: this.jwtService.sign(jwtPayload),
    };
  }

  async forgotPasswordOtp(user: ForgotPasswordDto) {
    const _user = await this.userService.findOne({ email: user.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp =
      process.env.NODE_ENV === PRODUCTION_NODE_ENV
        ? Math.floor(Math.random() * 1000000)
        : 123456;

    if (process.env.NODE_ENV === PRODUCTION_NODE_ENV) {
      // TODO: Send OTP to user's email later
    }
    await this.userService.updateUser(
      { _id: _user._id },
      { forgotPasswordOtp: { otp, Date: Date.now() } },
    );
  }

  async verifyForgotPasswordOtp(verifyForgotPasswordInfo: VerifyPasswordDto) {
    const user = await this.userService.findOne({
      email: verifyForgotPasswordInfo.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.forgotPasswordOtp.otp !== verifyForgotPasswordInfo.otp) {
      throw new BadRequestException('OTP is not valid');
    }

    // TODO: Check if OTP is expired

    await this.userService.updateUser(
      { _id: user._id },
      {
        password: hashSync(verifyForgotPasswordInfo.password),
        forgotPasswordOtp: {},
      },
    );
  }
}
