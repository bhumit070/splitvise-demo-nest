import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from 'src/mongodb/models/user.model';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dtos/user.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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
}
