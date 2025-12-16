import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  Query,
  HttpException,
} from '@nestjs/common';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateCommentDTO } from '@dtos/task/comment/create-comment.dto';

export const MAXIMUM_PAGE_SIZE = 50;

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDTO,
    @Req() req: { user: { userId: string } },
  ) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('page') page?: number, @Query('size') size?: number) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(size) || 10;

    if (pageSize > 50) {
      throw new HttpException(
        `The maximum page size is ${MAXIMUM_PAGE_SIZE}`,
        400,
      );
    }

    const response = this.tasksService.findAll(pageNumber, pageSize);
    return response;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post(':taskId/comments')
  createComment(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDTO,
    @Req() req: { user: { userId: string } },
  ) {
    return this.tasksService.createComment(
      req.user.userId,
      taskId,
      createCommentDto,
    );
  }

  @Get(':taskId/comments')
  findComments(
    @Param('taskId') taskId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(size) || 10;

    if (pageSize > 50) {
      throw new HttpException(
        `The maximum page size is ${MAXIMUM_PAGE_SIZE}`,
        400,
      );
    }
    return this.tasksService.findComments(taskId, pageNumber, pageSize);
  }

  @Put(':id')
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDTO,
    @Req() req: { user: { userId: string } },
  ) {
    return this.tasksService.update(taskId, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
