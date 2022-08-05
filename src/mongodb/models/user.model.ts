import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashSync } from 'bcryptjs';

type User = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    select: false,
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);

UserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 10);
  return next();
});

UserSchema.pre('updateOne', function (next) {
  if (this.isModified(this.password)) {
    this.password = hashSync(this.password, 10);
  }
  return next();
});
