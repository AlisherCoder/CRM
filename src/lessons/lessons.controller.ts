import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/user/dto/create-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { QueryLessonDto } from './dto/quury-lesson.dto';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiBody({ type: CreateLessonDto })
  @ApiResponse({ status: 201, description: 'lesson created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or bad request' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all lessons with filters, sorting and pagination',
  })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'course', required: false, type: String })
  @ApiQuery({ name: 'teacher', required: false, type: String })
  @ApiQuery({ name: 'group', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Not  found Lessons' })
  findAll(@Query() query: QueryLessonDto) {
    return this.lessonsService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single lesson by ID' })
  @ApiParam({ name: 'id', type: String, description: 'lesson ID' })
  @ApiResponse({ status: 200, description: 'lesson retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ID or lesson not found' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a lesson by ID' })
  @ApiParam({ name: 'id', type: String, description: 'lesson ID' })
  @ApiBody({ type: UpdateLessonDto })
  @ApiResponse({ status: 200, description: 'lesson updated successfully' })
  @ApiResponse({ status: 400, description: 'Update failed' })
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({ name: 'id', type: String, description: 'lesson ID' })
  @ApiResponse({ status: 200, description: 'lesson deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Delete failed or lesson not found',
  })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
