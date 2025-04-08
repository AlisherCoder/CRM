import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { Request } from 'express';
import { QueryUserDto } from './dto/query-user.dto';
@Injectable()
export class UserService {
  private acckey = process.env.ACCKEY;
  private refkey = process.env.REFKEY;

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let { password, phone } = createUserDto;
    try {
      let user = await this.UserModel.findOne({ phone });
      if (user) {
        return new ConflictException(
          'A user with this phone number already exists',
        );
      }

      let hashpass = await bcrypt.hash(password, 10);
      let data = await this.UserModel.create({
        ...createUserDto,
        password: hashpass,
      });

      let result = data.toObject() as Partial<User>;
      delete result.password;

      return { data: result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    let { password, phone } = loginUserDto;
    try {
      let user = await this.UserModel.findOne({ phone });
      if (!user) {
        return new UnauthorizedException('User not found');
      }

      let isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new BadRequestException('Invalid password or phone');
      }

      let accessToken = this.genAccessToken({ id: user._id, role: user.role });
      let refreshToken = this.genRefreshToken({
        id: user._id,
        role: user.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMyData(req: Request) {
    let user = req['user'];
    try {
      let data = await this.UserModel.findById(user.id)
        .populate('groups courses')
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
      let data = await this.UserModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort([[sortBy, orderBy]])
        .select(['-password', '-groups', '-courses'])
        .exec();

      if (!data.length) {
        throw new NotFoundException('Not found users');
      }

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      let data = await this.UserModel.findById(id)
        .populate('groups courses')
        .select('-password')
        .exec();

      if (!data) {
        return new NotFoundException('User not found');
      }

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    let { password, phone } = updateUserDto;
    if (password) {
      updateUserDto.password = bcrypt.hashSync(password, 10);
    }

    try {
      let user = await this.UserModel.findById(id);
      if (!user) {
        return new NotFoundException('User not found');
      }

      if (phone) {
        let isExists = await this.UserModel.findOne({ phone });
        if (isExists) {
          return new ConflictException(
            'A user with this phone number already exists',
          );
        }
      }

      let data = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
        .select('-password')
        .exec();

      if (updateUserDto.image) {
        let filepath = join('uploads', user.image);
        try {
          unlinkSync(filepath);
        } catch (error) {
          console.log(error.message);
        }
      }

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      let data = await this.UserModel.findByIdAndDelete(id);
      if (!data) {
        return new NotFoundException('User not found');
      }

      let filepath = join('uploads', data.image);
      try {
        unlinkSync(filepath);
      } catch (error) {
        console.log(error.message);
      }

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  genAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.acckey,
      expiresIn: '12h',
    });
  }

  genRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.refkey,
      expiresIn: '7d',
    });
  }
}
