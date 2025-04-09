import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupsDocument = HydratedDocument<Groups>;

@Schema({ versionKey: false, timestamps: true })
export class Groups {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Courses' }], required: true })
  courses: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  students: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  teachers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lessons' }], required: false })
  lessons?: Types.ObjectId[];
}

export const GroupsSchema = SchemaFactory.createForClass(Groups);
