import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Courses, CoursesSchema } from './schema/course.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Groups, GroupsSchema } from 'src/groups/schema/group.schema';
import { Lessons, LessonsSchema } from 'src/lessons/schema/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Courses.name, schema: CoursesSchema },
      { name: User.name, schema: UserSchema },
      { name: Groups.name, schema: GroupsSchema },
      { name: Lessons.name, schema: LessonsSchema },
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
