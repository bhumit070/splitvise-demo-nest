import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from 'src/mongodb/models/user.model';
import { CreateUserDto } from './dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private UserModel: Model<UserDocument>,
  ) {}

  async signup(user) {
    return await this.UserModel.create(user);
  }
}
