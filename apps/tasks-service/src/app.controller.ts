import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { CreateCommentDTO } from '@dtos/task/comment/create-comment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('tasks.create')
  create(
    @Payload()
    { userId, createTaskDto }: { userId: string; createTaskDto: CreateTaskDTO },
  ) {
    return this.appService.create(createTaskDto, userId);
  }

  @MessagePattern('tasks.find.all')
  findAll(
    @Payload()
    { pageNumber, pageSize }: { pageNumber: number; pageSize: number },
  ) {
    return this.appService.findAll(pageNumber, pageSize);
  }

  @MessagePattern('tasks.comments.create')
  createComment(
    @Payload()
    {
      userId,
      taskId,
      createCommentDto,
    }: {
      userId: string;
      taskId: string;
      createCommentDto: CreateCommentDTO;
    },
  ) {
    return this.appService.createComment(userId, taskId, createCommentDto);
  }

  @MessagePattern('tasks.comments.find.all')
  findAllComments(
    @Payload()
    {
      taskId,
      pageNumber,
      pageSize,
    }: {
      taskId: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return this.appService.findAllComments(taskId, pageNumber, pageSize);
  }

  @MessagePattern('tasks.find.byId')
  findOne(@Payload() id: string) {
    return this.appService.findOne(id);
  }

  @MessagePattern('tasks.update.byId')
  update(
    @Payload()
    {
      taskId,
      updateTaskDto,
      userId,
    }: {
      taskId: string;
      updateTaskDto: UpdateTaskDTO;
      userId: string;
    },
  ) {
    return this.appService.update(taskId, updateTaskDto, userId);
  }

  @MessagePattern('tasks.delete.byId')
  remove(@Payload() { taskId, userId }: { taskId: string; userId: string }) {
    return this.appService.remove(taskId, userId);
  }
}
