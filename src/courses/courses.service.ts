import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from './schema/course.schema';
import { Model, Types } from 'mongoose';
import { QueryCourseDto } from './dto/query-ccourse.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Courses.name) private CourseModel: Model<Courses>) {}

  async create(createCourseDto: CreateCourseDto) {
    let { parent } = createCourseDto;
    try {
      if (parent) {
        let parentCourse = await this.CourseModel.findById(parent).exec();

        if (!parentCourse) {
          throw new BadRequestException('Parent course not found');
        }

        createCourseDto.parent = new Types.ObjectId(parent);
      }

      let newCourse = await this.CourseModel.create(createCourseDto);

      return { data: newCourse };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryCourseDto) {
    let {
      page = 1,
      limit = 10,
      orderBy = 'asc',
      sortBy = 'name',
      ...search
    } = query;

    let filter: any = {};

    if (search.name) filter.name = { $regex: search.name, $options: 'i' };

    if (search.price) filter.price = search.price;

    if (search.maxPrice) filter.price = { $lte: search.maxPrice };

    if (search.minPrice) filter.price = { $gte: search.minPrice };

    if (search.maxPrice && search.minPrice)
      filter.price = { $lte: search.maxPrice, $gte: search.minPrice };

    if (search.parent) filter.parent = new Types.ObjectId(search.parent);

    if (search.duration_value) filter.duration_value = search.duration_value;
    if (search.duration_unit) filter.duration_unit = search.duration_unit;

    try {
      let courses = await this.CourseModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort([[sortBy, orderBy]])
        .select(['-teachers', '-groups', '-lessons'])
        .exec();

      if (!courses.length) {
        return new NotFoundException('Not found courses');
      }

      return { data: courses };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let course = await this.CourseModel.findById(id)
        .populate({ path: 'parent', select: 'name' })
        .populate({ path: 'children', select: 'name' })
        .populate({ path: 'teachers', select: ['full_name', 'image', 'phone'] })
        .populate({ path: 'groups', select: 'name' })
        .populate({ path: 'lessons' });

      if (!course) {
        return new NotFoundException('Not found course');
      }

      return { data: course };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      let updatedCourse = await this.CourseModel.findByIdAndUpdate(
        id,
        updateCourseDto,
        { new: true },
      ).exec();

      if (!updatedCourse) {
        return new NotFoundException('Not found course');
      }

      return { data: updatedCourse };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let deletedCourse = await this.CourseModel.findByIdAndDelete(id).exec();

      if (!deletedCourse) {
        return new NotFoundException('Not found course');
      }

      await this.CourseModel.deleteMany({ parent: deletedCourse._id }).exec();

      return { data: deletedCourse };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
