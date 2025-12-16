import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { Inject, InjectionToken } from '@nestjs/common';
import { TASKS_SERVICE } from '@constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TaskDTO } from '@dtos/task/task.dto';
import { CreateCommentDTO } from '@dtos/task/comment/create-comment.dto';

export class TasksService {
  constructor(
    @Inject(TASKS_SERVICE as InjectionToken)
    private readonly tasksClient: ClientProxy,
  ) {}

  async remove(id: string) {
    const removed = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.delete.byId', id),
    );

    return removed;
  }
  async update(taskId: string, updateTaskDto: UpdateTaskDTO, userId: string) {
    const updatedTask = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.update.byId', {
        taskId,
        updateTaskDto,
        userId,
      }),
    );

    return updatedTask;
  }
  async findOne(id: string) {
    const task = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.find.byId', id),
    );

    return task;
  }
  async findAll(pageNumber: number, pageSize: number) {
    const allTasks = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.find.all', { pageNumber, pageSize }),
    );

    return allTasks;
  }

  async createComment(
    userId: string,
    taskId: string,
    createCommentDto: CreateCommentDTO,
  ) {
    const createdComment = await firstValueFrom<CreateCommentDTO>(
      this.tasksClient.send('tasks.comments.create', {
        userId,
        taskId,
        createCommentDto,
      }),
    );

    return createdComment;
  }

  async findComments(taskId: string, pageNumber?: number, pageSize?: number) {
    const allTasks = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.comments.find.all', {
        taskId,
        pageNumber,
        pageSize,
      }),
    );

    return allTasks;
  }

  async create(createTaskDto: CreateTaskDTO, userId: string) {
    const createdTask = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.create', { createTaskDto, userId }),
    );

    return createdTask;
  }
}
