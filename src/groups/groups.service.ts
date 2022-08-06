import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseGroup } from 'src/mongodb/models/group.model';
import { CreateGroupDto } from './dtos/group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(ExpenseGroup.name)
    private ExpenseGroupModel: Model<ExpenseGroup>,
  ) {}

  createGroup(createGroupPayload: CreateGroupDto, userId: string) {
    return this.ExpenseGroupModel.create({
      name: createGroupPayload.name,
      createdBy: userId,
    });
  }

  async updateGroup(
    createGroupPayload: CreateGroupDto,
    groupId: string,
    userId: string,
  ) {
    const updated = await this.ExpenseGroupModel.findOneAndUpdate(
      { createdBy: userId, _id: groupId },
      { name: createGroupPayload.name },
      { new: true },
    );

    return updated;
  }

  deleteGroup(groupId: string, userId: string) {
    return this.ExpenseGroupModel.deleteOne({
      createdBy: userId,
      _id: groupId,
    });
  }
}
