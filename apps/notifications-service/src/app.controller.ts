import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { TaskCreatedEventDTO } from '@dto/notifications/task.created.event.dto';
import { TaskCommentCreatedEventDTO } from '@dto/notifications/task.comment.created.event.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TaskUpdatedEventDTO } from '@dto/notifications/task.updated.event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('task.created')
  handleTaskCreated(@Payload() taskCreatedEventDto: TaskCreatedEventDTO) {
    return this.appService.handleTaskCreated(taskCreatedEventDto);
  }
  @EventPattern('task.updated')
  handleTaskUpdated(@Payload() taskUpdatedEventDto: TaskUpdatedEventDTO) {
    return this.appService.handleTaskUpdated(taskUpdatedEventDto);
  }
  @EventPattern('task.comment.created')
  handleNewComment(@Payload() commentNewEventDto: TaskCommentCreatedEventDTO) {
    return this.appService.handleNewComment(commentNewEventDto);
  }
}
