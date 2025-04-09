import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CoursesDocument = HydratedDocument<Courses>;

@Schema({ versionKey: false, timestamps: true })
export class Courses {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration_value: number;

  @Prop({ enum: ['day', 'week', 'month', 'year'], required: true })
  duration_unit: 'day' | 'week' | 'month' | 'year';

  @Prop({ type: Types.ObjectId, ref: 'Courses', default: null })
  parent: Types.ObjectId | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Groups' }], required: false })
  groups?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: false })
  teachers?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Lessons', required: false })
  lessons?: Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);

CoursesSchema.virtual('children', {
  ref: 'Courses',
  localField: '_id',
  foreignField: 'parent',
});

CoursesSchema.set('toObject', { virtuals: true });
CoursesSchema.set('toJSON', { virtuals: true });
