import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonsDocument = HydratedDocument<Lessons>;

@Schema({ versionKey: false, timestamps: true })
export class Lessons {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ type: Types.ObjectId, ref: 'Groups', required: true })
  group: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Courses', required: true })
  course: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacher: Types.ObjectId;
}

export const LessonsSchema = SchemaFactory.createForClass(Lessons);
