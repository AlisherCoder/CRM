import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Courses, CoursesSchema } from 'src/courses/schema/course.schema';
import { Groups, GroupsSchema } from 'src/groups/schema/group.schema';
import { Lessons, LessonsSchema } from 'src/lessons/schema/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Courses.name, schema: CoursesSchema },
      { name: Groups.name, schema: GroupsSchema },
      { name: Lessons.name, schema: LessonsSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
