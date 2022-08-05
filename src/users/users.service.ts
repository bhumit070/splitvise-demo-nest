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

  async searchUsers(findUserPayload: IFindOne) {
    const orQuery = [];
    if (findUserPayload._id) orQuery.push({ _id: findUserPayload._id });
    if (findUserPayload.email) orQuery.push({ email: findUserPayload.email });
    if (findUserPayload.username)
      orQuery.push({ username: findUserPayload.username });

    return orQuery.length
      ? this.UserModel.find({
          $or: orQuery,
        })
      : this.UserModel.find();
  }

  // TODO: HANDLE THIS ANY LATER
  async updateUser(condition: IFindOne, infoToUpdate: any) {
    return await this.UserModel.updateOne(condition, infoToUpdate);
  }
}
