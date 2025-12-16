import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

export enum TaskLogAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  COMMENT_CREATED = 'COMMENT_CREATED',
  ARCHIVED = 'ARCHIVED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  PRIORITY_CHANGED = 'PRIORITY_CHANGED',
  ASSIGNED_USERS_CHANGED = 'ASSIGNED_USERS_CHANGED',
  DELETED = 'DELETED',
  DEADLINE_CHANGED = 'DEADLINE_CHANGED',
  TITLE_CHANGED = 'TITLE_CHANGED',
  DESCRIPTION_CHANGED = 'DESCRIPTION_CHANGED',
}

@Entity()
export class TaskLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.history_log, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ type: 'enum', enum: TaskLogAction })
  action: TaskLogAction;

  @Column({ type: 'jsonb', nullable: true })
  before: any;

  @Column({ type: 'jsonb', nullable: true })
  after: any;

  @Column({ type: 'jsonb', nullable: true })
  delta: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
