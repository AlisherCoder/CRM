import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Groups } from './schema/group.schema';
import { Model } from 'mongoose';
import { Courses } from 'src/courses/schema/course.schema';
import { User } from 'src/user/schema/user.schema';

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

  async findAll() {
    try {
      let groups = await this.GroupModel.find()
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
    try {
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
