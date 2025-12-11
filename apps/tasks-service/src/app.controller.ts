import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('tasks.create')
  create(@Payload() createTaskDto: CreateTaskDTO) {
    return this.appService.create(createTaskDto);
  }

  @MessagePattern('tasks.find.all')
  findAll() {
    return this.appService.findAll();
  }

  @MessagePattern('tasks.find.byId')
  findOne(@Payload() id: string) {
    return this.appService.findOne(id);
  }

  @MessagePattern('tasks.update.byId')
  update(
    @Payload()
    { id, updateTaskDto }: { id: string; updateTaskDto: UpdateTaskDTO },
  ) {
    return this.appService.update(id, updateTaskDto);
  }

  @MessagePattern('tasks.delete.byId')
  remove(@Payload() id: string) {
    return this.appService.remove(id);
  }
}
