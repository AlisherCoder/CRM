import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupsDocument = HydratedDocument<Groups>;

@Schema({ versionKey: false, timestamps: true })
export class Groups {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Courses' }], required: false })
  courses?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: false })
  students?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: false })
  teachers?: Types.ObjectId[];
}

export const GroupsSchema = SchemaFactory.createForClass(Groups);
