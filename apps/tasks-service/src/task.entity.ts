import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TaskPriorityEnum from '../../../packages/types/enums/task/TaskPriorityEnum';
import TaskStatusEnum from '../../../packages/types/enums/task/TaskStatusEnum';
import { TaskComment } from './task-comment.entity';
import { TaskLog } from './task-log.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date;

  @Column('text')
  priority: TaskPriorityEnum = TaskPriorityEnum.LOW;

  @Column('text')
  status: TaskStatusEnum = TaskStatusEnum.TODO;

  @Column('text', { array: true, nullable: true })
  assignedUsers: string[];

  @OneToMany(() => TaskComment, (comment) => comment.task)
  comments: TaskComment[];

  @OneToMany(() => TaskLog, (log) => log.task)
  history_log: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
