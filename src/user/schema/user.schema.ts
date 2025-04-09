import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../dto/create-user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, required: true })
  role: Role;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Groups' }], required: false })
  groups: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Courses' }], required: false })
  courses: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Lessons', required: false })
  lessons?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
