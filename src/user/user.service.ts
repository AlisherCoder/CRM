import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { Request } from 'express';
import { unlinkSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { Courses } from 'src/courses/schema/course.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Courses.name) private CourseModel: Model<Courses>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let { password, phone, courses } = createUserDto;
    try {
      let user = await this.UserModel.findOne({ phone }).exec();
      if (user) {
        return new ConflictException(
          'A user with this phone number already exists',
        );
      }

      let hashpass = await bcrypt.hash(password, 10);
      let newUser = await this.UserModel.create({
        ...createUserDto,
        password: hashpass,
      });

      let result = newUser.toObject() as Partial<User>;
      delete result.password;

      if (courses && courses?.length) {
        await this.CourseModel.updateMany(
          { _id: { $in: courses } },
          { $addToSet: { teachers: newUser._id } },
        );
      }

      return { data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMyData(req: Request) {
    let user = req['user'];
    try {
      let data = await this.UserModel.findById(user.id)
        .populate({ path: 'groups', select: 'name' })
        .populate({ path: 'courses', select: 'name' })
        .select('-password')
        .exec();
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryUserDto) {
    let {
      page = 1,
      limit = 10,
      orderBy = 'asc',
      sortBy = 'full_name',
      full_name,
      phone,
      role,
    } = query;

    let filter: any = {};

    if (full_name) filter.full_name = { $regex: full_name, $options: 'i' };
    if (phone) filter.phone = { $regex: phone, $options: 'i' };
    if (role) filter.role = role;

    try {
      let users = await this.UserModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort([[sortBy, orderBy]])
        .select(['-password', '-groups', '-courses'])
        .exec();

      if (!users.length) {
        throw new NotFoundException('Not found users');
      }

      return { data: users };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      let user = await this.UserModel.findById(id)
        .populate({ path: 'groups', select: 'name' })
        .populate({ path: 'courses', select: 'name' })
        .select('-password')
        .exec();

      if (!user) {
        return new NotFoundException('User not found');
      }

      return { data: user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    let { password, phone, courses } = updateUserDto;

    if (password) {
      updateUserDto.password = bcrypt.hashSync(password, 10);
    }

    try {
      let user = await this.UserModel.findById(id).exec();

      if (!user) {
        return new NotFoundException('User not found');
      }

      if (phone) {
        let isExists = await this.UserModel.findOne({ phone }).exec();
        if (isExists) {
          return new ConflictException(
            'A user with this phone number already exists',
          );
        }
      }

      let oldCourses: any = user.courses;
      oldCourses = oldCourses.map((id: string) => id.toString());

      let updatedUser = await this.UserModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true,
        },
      )
        .select('-password')
        .exec();

      if (courses && courses.length) {
        await this.CourseModel.updateMany(
          { _id: { $in: courses } },
          { $addToSet: { teachers: updatedUser?._id } },
        );
      }

      let removedCoursesId = oldCourses.filter((id) => !courses?.includes(id));

      if (removedCoursesId.length) {
        await this.CourseModel.updateMany(
          { _id: { $in: removedCoursesId } },
          { $pull: { teachers: updatedUser?._id } },
        );
      }

      if (updateUserDto.image) {
        let filepath = join('uploads', user.image);
        try {
          unlinkSync(filepath);
        } catch (error) {
          console.log(error.message);
        }
      }

      return { data: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      let deletedUser = await this.UserModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        return new NotFoundException('User not found');
      }

      await this.CourseModel.updateMany(
        { _id: { $in: deletedUser.courses } },
        { $pull: { teachers: deletedUser?._id } },
      );

      let filepath = join('uploads', deletedUser.image);
      try {
        unlinkSync(filepath);
      } catch (error) {
        console.log(error.message);
      }

      return { data: deletedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
