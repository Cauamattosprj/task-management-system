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
