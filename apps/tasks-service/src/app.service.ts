import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TaskLog, TaskLogAction } from './task-log.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskLog)
    private readonly logRepository: Repository<TaskLog>,
  ) {}

  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  update(id: string, updateTaskDto: UpdateTaskDTO) {
    throw new Error('Method not implemented.');
  }
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  async create(createTaskDto: CreateTaskDTO, userId: string) {
    console.log('DADOS RECEBEIDOS NO METODO CREATE', createTaskDto, userId);
    const savedTask = await this.taskRepository.save(createTaskDto);
    const log = await this.logRepository.save({
      taskId: savedTask.id,
      action: TaskLogAction.CREATED,
      userId: userId,
    });

    return savedTask;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
