import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/mongodb/models/user.model';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
