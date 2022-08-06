import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpenseGroup,
  ExpenseGroupSchema,
} from 'src/mongodb/models/group.model';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: ExpenseGroup.name,
        schema: ExpenseGroupSchema,
      },
    ]),
  ],
})
export class GroupsModule {}
