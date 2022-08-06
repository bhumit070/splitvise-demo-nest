import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { User } from 'src/mongodb/models/user.model';
import { CreateGroupDto } from './dtos/group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    const user = req.user as User;
    return this.groupsService.createGroup(createGroupDto, user._id);
  }
}
