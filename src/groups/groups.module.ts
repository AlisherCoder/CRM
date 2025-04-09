import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from './schema/group.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Courses, CoursesSchema } from 'src/courses/schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Groups.name, schema: GroupsSchema },
      { name: User.name, schema: UserSchema },
      { name: Courses.name, schema: CoursesSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
