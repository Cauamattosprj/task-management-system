import { TaskCreatedEventDTO } from '@dto/notifications/task.created.event.dto';
import { TaskUpdatedEventDTO } from '@dto/notifications/task.updated.event.dto';
import { Inject, Injectable, InjectionToken } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { TaskCommentCreatedEventDTO } from '@dto/notifications/task.comment.created.event.dto';
import { TaskDTO } from '@dto/task/task.dto';
import { TASKS_SERVICE } from '@constants/index';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly notifificationGateway: NotificationGateway,
    @Inject(TASKS_SERVICE as InjectionToken)
    private readonly tasksClient: ClientProxy,
  ) {}

  handleTaskUpdated(event: TaskUpdatedEventDTO) {
    const recipients = event.assigneesId;

    if (!recipients) {
      return;
    }

    for (const userId of recipients) {
      this.notifificationGateway.emitToUser(userId, 'task:updated', {
        taskId: event.taskId,
        title: event.taskTitle,
        createdAt: event.createdAt,
      });
    }
  }

  handleTaskCreated(event: TaskCreatedEventDTO) {
    const recipients = this.resolveRecipients(event);

    if (!recipients) {
      this.notifificationGateway.emitToAll('task:created', {
        taskId: event.taskId,
        title: event.taskTitle,
        createdAt: event.createdAt,
      });
      return;
    }

    for (const userId of recipients) {
      this.notifificationGateway.emitToUser(userId, 'task:created', {
        taskId: event.taskId,
        title: event.taskTitle,
        createdAt: event.createdAt,
      });
    }
  }

  private resolveRecipients(event: TaskCreatedEventDTO) {
    if (event.assigneesId) return event.assigneesId;
  }

  async handleNewComment(event: TaskCommentCreatedEventDTO) {
    const task = await firstValueFrom<TaskDTO>(
      this.tasksClient.send('tasks.find.byId', event.taskId),
    );

    const recipients = task.assignedUsersIds;

    if (!recipients) {
      return;
    }

    for (const userId of recipients) {
      this.notifificationGateway.emitToUser(userId, 'comment:new', {
        taskId: event.taskId,
        title: task.title,
        body: event.comment,
        createdAt: event.createdAt,
      });
    }
  }
}
