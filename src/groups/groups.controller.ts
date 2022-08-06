import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { User } from 'src/mongodb/models/user.model';
import { CreateGroupDto } from './dtos/group.dto';
import { GroupsService } from './groups.service';
import { IsGroupOwnerGuard } from './guards/group-owner.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    const user = req.user as User;
    return this.groupsService.createGroup(createGroupDto, user._id);
  }

  @Patch('/:groupId')
  @UseGuards(IsGroupOwnerGuard)
  updateGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    const groupId = req.params.groupId;
    const user = req.user as User;
    return this.groupsService.updateGroup(createGroupDto, groupId, user._id);
  }

  @Delete('/:groupId')
  @UseGuards(IsGroupOwnerGuard)
  deleteGroup(@Req() req: Request) {
    const groupId = req.params.groupId;
    const user = req.user as User;
    return this.groupsService.deleteGroup(groupId, user._id);
  }
}
