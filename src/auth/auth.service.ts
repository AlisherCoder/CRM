import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private acckey = process.env.ACCKEY;
  private refkey = process.env.REFKEY;
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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

  async refreshToken(req: Request) {
    let user = req['user'];
    try {
      let accessToken = this.genAccessToken({ id: user.id, role: user.role });
      return { accessToken };
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
