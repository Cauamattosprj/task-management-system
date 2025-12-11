import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TaskPriorityEnum from '@enums/task/TaskPriorityEnum';
import TaskStatusEnum from '@enums/task/TaskStatusEnum';
import { TaskComment } from './task-comment.entity';

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
  comments: TaskComment[]

  // @Column('text', { array: true })
  // history_log: string[];
}
