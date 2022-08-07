import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/mongodb/models/user.model';
import { GroupsService } from '../groups.service';

@Injectable()
export class IsGroupMember implements CanActivate {
  constructor(private readonly groupService: GroupsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const groupId = context.switchToHttp().getRequest()?.params?.groupId;

    const group = await this.groupService.getGroups(user._id, groupId);

    if (!group) {
      return false;
    }
    request.group = group;
    return true;
  }
}
