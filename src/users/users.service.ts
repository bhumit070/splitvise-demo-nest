import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserDocument } from 'src/mongodb/models/user.model';

interface IFindOne {
  email?: string;
  _id?: string;
  username?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private UserModel: Model<UserDocument>,
  ) {}

  async findOne(findUserPayload: IFindOne) {
    const user = await this.UserModel.findOne(findUserPayload).select(
      '+password',
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }
}
