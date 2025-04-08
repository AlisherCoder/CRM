import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  private refkey = process.env.REFKEY;
  constructor(private jwtServise: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let { refresh_token } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      let data = this.jwtServise.verify(refresh_token, { secret: this.refkey });
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
