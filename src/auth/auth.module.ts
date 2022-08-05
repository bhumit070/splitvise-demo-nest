import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from 'src/mongodb/models/user.model';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class AuthModule {}
