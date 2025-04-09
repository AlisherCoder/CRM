import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  AddDelCourseDto,
  AddDelStudentDto,
  AddDelTeacherDto,
  CreateGroupDto,
} from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryGroupDto } from './dto/query-group.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or bad request' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all groups with filters, sorting and pagination',
  })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'startDate', 'endDate'],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Not  found Courses' })
  findAll(@Query() query: QueryGroupDto) {
    return this.groupsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single group by ID' })
  @ApiParam({ name: 'id', type: String, description: 'group ID' })
  @ApiResponse({ status: 200, description: 'group retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ID or group not found' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch('add-student')
  @ApiOperation({ summary: 'Add a student to group' })
  @ApiBody({ type: AddDelStudentDto })
  @ApiResponse({ status: 200, description: 'Add student successfully' })
  @ApiResponse({ status: 400, description: 'Add student failed' })
  addStudent(@Body() addStudentDto: AddDelStudentDto) {
    return this.groupsService.addStudent(addStudentDto);
  }

  @Patch('remove-student')
  @ApiOperation({ summary: 'Delete a student from group' })
  @ApiBody({ type: AddDelStudentDto })
  @ApiResponse({ status: 200, description: 'Delete student  successfully' })
  @ApiResponse({ status: 400, description: 'Delete student failed' })
  removeStudent(@Body() delStudentDto: AddDelStudentDto) {
    return this.groupsService.removeStudent(delStudentDto);
  }

  @Patch('add-course')
  @ApiOperation({ summary: 'Add a course to group' })
  @ApiBody({ type: AddDelCourseDto })
  @ApiResponse({ status: 200, description: 'Add course successfully' })
  @ApiResponse({ status: 400, description: 'Add course failed' })
  addCourse(@Body() addCourseDto: AddDelCourseDto) {
    return this.groupsService.addCourse(addCourseDto);
  }

  @Patch('remove-course')
  @ApiOperation({ summary: 'Delete a course from group' })
  @ApiBody({ type: AddDelCourseDto })
  @ApiResponse({ status: 200, description: 'Delete course successfully' })
  @ApiResponse({ status: 400, description: 'Delete course failed' })
  removeCourse(@Body() delCourseDto: AddDelCourseDto) {
    return this.groupsService.removeCourse(delCourseDto);
  }

  @Patch('add-teacher')
  @ApiOperation({ summary: 'Add a teacher to group' })
  @ApiBody({ type: AddDelTeacherDto })
  @ApiResponse({ status: 200, description: 'Add teacher successfully' })
  @ApiResponse({ status: 400, description: 'Add teacher failed' })
  addTeacher(@Body() addTeacherDto: AddDelTeacherDto) {
    return this.groupsService.addTeacher(addTeacherDto);
  }

  @Patch('remove-teacher')
  @ApiOperation({ summary: 'Delete a teacher from group' })
  @ApiBody({ type: AddDelTeacherDto })
  @ApiResponse({ status: 200, description: 'Delete teacher successfully' })
  @ApiResponse({ status: 400, description: 'Delete teacher failed' })
  removeTeacher(@Body() delTeacherDto: AddDelTeacherDto) {
    return this.groupsService.removeTeacher(delTeacherDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group by ID' })
  @ApiParam({ name: 'id', type: String, description: 'group ID' })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ status: 200, description: 'group updated successfully' })
  @ApiResponse({ status: 400, description: 'Update failed' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group by ID' })
  @ApiParam({ name: 'id', type: String, description: 'group ID' })
  @ApiResponse({ status: 200, description: 'group deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Delete failed or group not found',
  })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
