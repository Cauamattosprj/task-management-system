import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { Inject, Injectable, InjectionToken, Logger } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TaskLog, TaskLogAction } from './task-log.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { diffChars } from 'diff';
import { USERS_SERVICE } from '@constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskLog)
    private readonly logRepository: Repository<TaskLog>,

    @Inject(USERS_SERVICE as InjectionToken)
    private readonly usersClient: ClientProxy,
  ) {}

  async remove(taskId: string, userId: string) {
    Logger.log('TasksService.remove: ', { taskId, userId });
    const originalTask = await this.taskRepository.findOneBy({ id: taskId });
    const softDeletedTask = await this.taskRepository.update(taskId, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    if (softDeletedTask) {
      const log = await this.logRepository.save({
        taskId: taskId,
        action: TaskLogAction.DELETED,
        userId: userId,
      });

      if (!log && originalTask) {
        await this.taskRepository.update(taskId, originalTask);
        throw new RpcException({
          message: `Failed to save task log. The task was rolled back.`,
          statusCode: 500,
        });
      }

      return softDeletedTask;
    }
  }
  async update(taskId: string, updateTaskDto: UpdateTaskDTO, userId: string) {
    Logger.log('TasksService.update: ', { taskId, updateTaskDto, userId });

    if (!taskId) {
      throw new RpcException({
        statusCode: 400,
        message: 'Task id is not valid. TaskId received: ' + taskId,
      });
    }

    const originalTask = await this.taskRepository.findOneBy({ id: taskId });
    if (!originalTask) {
      throw new RpcException({ message: 'Task not found', statusCode: 404 });
    }

    if (updateTaskDto.assignedUsersIds) {
      if (!Array.isArray(updateTaskDto.assignedUsersIds)) {
        throw new RpcException({
          statusCode: 400,
          message: 'assignedUsersIds must be an array of UUIDs',
        });
      }

      const validationResults = await Promise.all(
        updateTaskDto.assignedUsersIds.map(async (assignedId) => {
          try {
            const user = await firstValueFrom(
              this.usersClient.send('user.get.byId', assignedId),
            );

            return { id: assignedId, exists: !!user };
          } catch (error) {
            Logger.error('Attempt to assigned to an unexisting user', error);
            return { id: assignedId, exists: false };
          }
        }),
      );

      const invalidUsers = validationResults.filter((r) => !r.exists);

      if (invalidUsers.length > 0) {
        throw new RpcException({
          statusCode: 400,
          message:
            'One or more assignedUsersIds do not correspond to valid users: ' +
            invalidUsers.map((u) => u.id).join(', '),
        });
      }
    }

    const updatedTask = this.taskRepository.merge(originalTask, updateTaskDto);
    await this.taskRepository.save(updatedTask);

    const fieldsToCheck = [
      { key: 'priority', action: TaskLogAction.PRIORITY_CHANGED },
      { key: 'status', action: TaskLogAction.STATUS_CHANGED },
      { key: 'deadline', action: TaskLogAction.DEADLINE_CHANGED },
      { key: 'title', action: TaskLogAction.TITLE_CHANGED },
      { key: 'assignedUsersIds', action: TaskLogAction.ASSIGNED_USERS_CHANGED },
      { key: 'description', action: TaskLogAction.DESCRIPTION_CHANGED },
    ];

    for (const field of fieldsToCheck) {
      const before = originalTask[field.key];
      const after = updatedTask[field.key];

      const isArray = Array.isArray(before) && Array.isArray(after);
      const changed = isArray
        ? JSON.stringify(before) !== JSON.stringify(after)
        : before != after;

      if (!changed) continue;

      switch (field.key) {
        case 'description':
          await this.logRepository.save({
            taskId,
            action: field.action,
            userId,
            before,
            after,
          });
          break;

        default:
          await this.logRepository.save({
            taskId,
            action: field.action,
            userId,
            before,
            after,
          });
          break;
      }
    }

    return { message: `Task with id ${taskId} was sucessfully updated` };
  }

  async findOne(taskId: string) {
    Logger.log('TasksService.findOne: ', { taskId });

    return await this.taskRepository.findOneBy({ id: taskId });
  }

  async findAll(pageNumber: number, pageSize: number) {
    Logger.log('TasksService.findAll: ', { pageNumber, pageSize });

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const tasks = await this.taskRepository.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const total = await this.taskRepository.count();

    return {
      data: tasks,
      total,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(createTaskDto: CreateTaskDTO, userId: string) {
    const savedTask = await this.taskRepository.save(createTaskDto);

    if (savedTask) {
      const log = await this.logRepository.save({
        taskId: savedTask.id,
        action: TaskLogAction.CREATED,
        userId: userId,
      });

      if (!log) {
        await this.taskRepository.delete(savedTask.id);
        throw new RpcException({
          message: `Failed to save task log. The task was rolled back.`,
          statusCode: 500,
        });
      }

      return savedTask;
    }
  }
}
