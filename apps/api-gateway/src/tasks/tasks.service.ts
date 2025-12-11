import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { Inject, InjectionToken } from '@nestjs/common';
import { TASKS_SERVICE } from '@constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TaskDTO } from '@dtos/task/task.dto';

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
  async update(id: string, updateTaskDto: UpdateTaskDTO) {
    const updatedTask = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.update.byId', { id, updateTaskDto }),
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

  async create(createTaskDto: CreateTaskDTO, userId: string) {
    const createdTask = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.create', { createTaskDto, userId }),
    );

    return createdTask;
  }
}
