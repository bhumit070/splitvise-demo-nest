import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';

type GroupParticipantExtraFields = {
  isAccepted: boolean;
};

type GroupParticipant = Pick<User, 'name' | 'email' | 'username'> &
  GroupParticipantExtraFields;

export type Group = {
  name: string;
  createdBy: string;
  members: GroupParticipant[];
};

export type GroupDocument = Group & Document;

@Schema({
  timestamps: true,
})
export class ExpenseGroup {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'users',
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: false,
  })
  members: [GroupParticipant];
}

export const ExpenseGroupSchema = SchemaFactory.createForClass(ExpenseGroup);
