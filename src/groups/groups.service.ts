import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddDelCourseDto,
  AddDelStudentDto,
  AddDelTeacherDto,
  CreateGroupDto,
} from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Groups } from './schema/group.schema';
import { Model } from 'mongoose';
import { Courses } from 'src/courses/schema/course.schema';
import { User } from 'src/user/schema/user.schema';
import { QueryGroupDto } from './dto/query-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups.name) private GroupModel: Model<Groups>,
    @InjectModel(Courses.name) private CourseModel: Model<Courses>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    let { courses, teachers, students } = createGroupDto;
    try {
      let group = await this.GroupModel.findOne({
        name: createGroupDto.name,
      }).exec();

      if (group) {
        throw new BadRequestException('Group already exists with name');
      }

      let newGroup = await this.GroupModel.create(createGroupDto);

      await this.CourseModel.updateMany(
        { _id: { $in: courses } },
        { $addToSet: { groups: newGroup._id } },
      );

      await this.UserModel.updateMany(
        { _id: { $in: students } },
        { $addToSet: { groups: newGroup._id } },
      );

      await this.UserModel.updateMany(
        { _id: { $in: teachers } },
        { $addToSet: { groups: newGroup._id } },
      );

      return { data: newGroup };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addStudent(addStudentDto: AddDelStudentDto) {
    let { student_id, group_id } = addStudentDto;
    try {
      let student = await this.UserModel.findById(student_id);
      if (!student) {
        return new BadRequestException('Student not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (group.students.includes(student._id)) {
        throw new BadRequestException('Student already exists in group');
      }

      group.students.push(student._id);
      group.save();

      student.groups.push(group._id);
      student.save();

      return { data: 'Student added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeStudent(delStudentDto: AddDelStudentDto) {
    let { student_id, group_id } = delStudentDto;
    try {
      let student = await this.UserModel.findById(student_id);
      if (!student) {
        return new BadRequestException('Student not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (!group.students.includes(student._id)) {
        return new BadRequestException(
          'There is no such student in this group',
        );
      }

      group.students = group.students.filter(
        (id) => id.toString() !== student_id,
      );
      group.save();

      student.groups = student.groups.filter(
        (id) => id.toString() !== group_id,
      );
      student.save();

      return { data: 'Student deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addCourse(addCorseDto: AddDelCourseDto) {
    let { course_id, group_id } = addCorseDto;
    try {
      let course = await this.CourseModel.findById(course_id);
      if (!course) {
        return new BadRequestException('Course not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (group.courses.includes(course.id)) {
        throw new BadRequestException('Course already exists in group');
      }

      group.courses.push(course.id);
      group.save();

      course.groups?.push(group._id);
      course.save();

      return { data: 'Course added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeCourse(delCourse: AddDelCourseDto) {
    let { course_id, group_id } = delCourse;
    try {
      let course = await this.CourseModel.findById(course_id);
      if (!course) {
        return new BadRequestException('Course not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (!group.courses.includes(course.id)) {
        throw new BadRequestException('There is no such course in this group');
      }

      group.courses = group.courses.filter((id) => id.toString() !== course_id);
      group.save();

      course.groups = course.groups?.filter((id) => id.toString() !== group_id);
      course.save();

      return { data: 'Course deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addTeacher(addTeacherDto: AddDelTeacherDto) {
    let { teacher_id, group_id } = addTeacherDto;
    try {
      let teacher = await this.UserModel.findById(teacher_id);
      if (!teacher) {
        return new BadRequestException('Teacher not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (group.teachers.includes(teacher.id)) {
        throw new BadRequestException('Teacher already exists in group');
      }

      group.teachers.push(teacher.id);
      group.save();

      teacher.groups.push(group._id);
      teacher.save();

      return { data: 'Teacher added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeTeacher(delTeacherDto: AddDelTeacherDto) {
    let { teacher_id, group_id } = delTeacherDto;
    try {
      let teacher = await this.UserModel.findById(teacher_id);
      if (!teacher) {
        return new BadRequestException('Teacher not found');
      }

      let group = await this.GroupModel.findById(group_id);
      if (!group) {
        return new BadRequestException('Group not found');
      }

      if (!group.teachers.includes(teacher.id)) {
        throw new BadRequestException(
          'There is no such teacher in this group.',
        );
      }

      group.teachers = group.teachers.filter(
        (id) => id.toString() !== teacher_id,
      );
      group.save();

      teacher.groups = teacher.groups.filter(
        (id) => id.toString() !== group_id,
      );
      teacher.save();

      return { data: 'Teacher deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryGroupDto) {
    let {
      page = 1,
      limit = 10,
      sortBy = 'name',
      orderBy = 'asc',
      name,
      startDate,
      endDate,
      status,
    } = query;

    let filter: any = {};

    if (name) filter.name = { $regex: name, $options: 'i' };

    if (status !== undefined) filter.status = status;

    if (startDate) filter.startDate = new Date(startDate);
    if (endDate) filter.endDate = new Date(endDate);

    try {
      let groups = await this.GroupModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort([[sortBy, orderBy]])
        .select(['-teachers', '-courses', '-students'])
        .exec();

      if (!groups.length) {
        return new NotFoundException('Not found groups');
      }

      return { data: groups };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let group = await this.GroupModel.findById(id)
        .populate({ path: 'courses', select: 'name' })
        .populate({ path: 'teachers', select: ['full_name', 'image', 'phone'] })
        .populate({ path: 'students', select: ['full_name', 'image', 'phone'] })
        .exec();

      if (!group) {
        return new NotFoundException('Not found group');
      }

      return { data: group };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    let { name } = updateGroupDto;
    try {
      let group = await this.GroupModel.findOne({ name });
      if (group) {
        throw new BadRequestException('Group already exists with name');
      }

      let updatedGroup = await this.GroupModel.findByIdAndUpdate(
        id,
        updateGroupDto,
        { new: true },
      ).exec();

      if (!updatedGroup) {
        return new NotFoundException('Not found group');
      }

      return { data: updatedGroup };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let deletedGroup = await this.GroupModel.findByIdAndDelete().exec();

      if (!deletedGroup) {
        return new NotFoundException('Not found group');
      }

      await this.UserModel.updateMany(
        { _id: { $in: deletedGroup.students } },
        { $pull: { groups: deletedGroup._id } },
      );

      await this.UserModel.updateMany(
        { _id: { $in: deletedGroup.teachers } },
        { $pull: { groups: deletedGroup._id } },
      );

      await this.CourseModel.updateMany(
        { _id: { $in: deletedGroup.courses } },
        { $pull: { groups: deletedGroup._id } },
      );

      return { data: deletedGroup };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
