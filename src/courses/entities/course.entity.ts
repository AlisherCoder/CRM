import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CoursesDocument = HydratedDocument<Courses>;

@Schema({ versionKey: false, timestamps: true })
export class Courses {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'ChildCourses' }],
    required: false,
  })
  children?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Groups' }], required: false })
  group?: Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
