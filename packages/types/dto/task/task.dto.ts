import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import TaskStatusEnum from "../../enums/task/TaskStatusEnum";
import TaskPriorityEnum from "../../enums/task/TaskPriorityEnum";

export class TaskDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  @IsOptional()
  deadline: string;

  @IsEnum(TaskPriorityEnum)
  @IsNotEmpty()
  priority: TaskPriorityEnum = TaskPriorityEnum.LOW;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum = TaskStatusEnum.TODO;

  @IsArray()
  @IsOptional()
  assignedUsersIds: string[];

  @IsArray()
  @IsOptional()
  commentIds: string[];
}
