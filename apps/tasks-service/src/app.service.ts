import { UpdateTaskDTO } from '@dtos/task/update-task.dto';
import { CreateTaskDTO } from '@dtos/task/create-task.dto';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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
  create(createTaskDto: CreateTaskDTO) {
    return this.taskRepository.save(createTaskDto);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
