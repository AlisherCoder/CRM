import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Groups } from 'src/groups/schema/group.schema';
import { Courses } from 'src/courses/schema/course.schema';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Lessons } from './schema/lesson.schema';
import { QueryLessonDto } from './dto/quury-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Groups.name) private GroupModel: Model<Groups>,
    @InjectModel(Courses.name) private CourseModel: Model<Courses>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Lessons.name) private LessonModel: Model<User>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    let { course, group, teacher } = createLessonDto;
    try {
      let isCourse = await this.CourseModel.findById(course);
      if (!isCourse)
        throw new BadRequestException('Such course does not exist');

      let isGroup = await this.GroupModel.findById(group);
      if (!isGroup) throw new BadRequestException('Such group does not exist');

      let isTeacher = await this.UserModel.findById(teacher);
      if (!isTeacher)
        throw new BadRequestException('Such teacher does not exist');

      let newLesson = await this.LessonModel.create(createLessonDto);

      await this.GroupModel.findByIdAndUpdate(group, {
        $push: { lessons: newLesson._id },
      });

      await this.UserModel.findByIdAndUpdate(teacher, {
        $push: { lessons: newLesson._id },
      });

      await this.CourseModel.findByIdAndUpdate(course, {
        $push: { lessons: newLesson._id },
      });

      return { data: newLesson };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryLessonDto) {
    let { page = 1, limit = 10, orderBy = 'asc' } = query;

    let filter: any = {};

    if (query.date) {
      const dayStart = new Date(query.date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(query.date);
      dayEnd.setHours(23, 59, 59, 999);

      filter.date = { $gte: dayStart, $lte: dayEnd };
    }

    if (query.teacher) filter.teacher = query.teacher;
    if (query.group) filter.group = query.group;
    if (query.course) filter.course = query.course;

    try {
      let lessons = await this.LessonModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort([['date', orderBy]])
        .exec();

      if (!lessons.length) {
        return new NotFoundException('Not found lessons');
      }

      return { data: lessons };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let lesson = await this.LessonModel.findById(id)
        .populate({ path: 'group', select: 'name' })
        .populate({ path: 'teacher', select: ['full_name', 'image', 'phone'] })
        .populate({ path: 'course', select: 'name' })
        .exec();

      if (!lesson) {
        return new NotFoundException('Not found lesson');
      }

      return { data: lesson };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    try {
      let lesson = await this.LessonModel.findByIdAndUpdate(
        id,
        updateLessonDto,
        { new: true },
      ).exec();

      if (!lesson) {
        return new NotFoundException('Not found lesson');
      }

      return { data: lesson };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let lesson: any = await this.LessonModel.findByIdAndDelete(id).exec();

      if (!lesson) {
        return new NotFoundException('Not found lesson');
      }

      await this.GroupModel.findByIdAndUpdate(lesson.group, {
        $pull: { lessons: lesson._id },
      });

      await this.UserModel.findByIdAndUpdate(lesson.group, {
        $pull: { lessons: lesson._id },
      });

      await this.CourseModel.findByIdAndUpdate(lesson.group, {
        $pull: { lessons: lesson._id },
      });

      return { data: lesson };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
