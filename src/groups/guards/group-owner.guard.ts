import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseGroup } from 'src/mongodb/models/group.model';
import { User } from 'src/mongodb/models/user.model';

@Injectable()
export class IsGroupOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(ExpenseGroup.name)
    private ExpenseGroupModel: Model<ExpenseGroup>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user as User;
    const groupId = context.switchToHttp().getRequest()?.params?.groupId;

    const group = await this.ExpenseGroupModel.findById(groupId).lean();

    if (!group) {
      return false;
    }

    return String(user._id) === String(group.createdBy);
  }
}
