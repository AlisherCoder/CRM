import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from 'src/groups/schema/group.schema';
import { Courses, CoursesSchema } from 'src/courses/schema/course.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Lessons, LessonsSchema } from './schema/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Groups.name, schema: GroupsSchema },
      { name: Courses.name, schema: CoursesSchema },
      { name: User.name, schema: UserSchema },
      { name: Lessons.name, schema: LessonsSchema },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
