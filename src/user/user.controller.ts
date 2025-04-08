import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { SelfGuard } from 'src/guards/self.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('mydata')
  @ApiOperation({ summary: 'Get data of current logged-in user' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  getMyData(@Req() req: Request) {
    return this.userService.getMyData(req);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all users with filters, sorting and pagination',
  })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['full_name', 'createdAt'],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'full_name', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No users found' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ID or user not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Update failed' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Delete failed or user not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
