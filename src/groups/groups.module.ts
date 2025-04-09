import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from './schema/group.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Courses, CoursesSchema } from 'src/courses/schema/course.schema';
import { Lessons, LessonsSchema } from 'src/lessons/schema/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Groups.name, schema: GroupsSchema },
      { name: User.name, schema: UserSchema },
      { name: Courses.name, schema: CoursesSchema },
      { name: Lessons.name, schema: LessonsSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
