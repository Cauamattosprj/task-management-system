import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class TaskCreatedEventDTO {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
  @IsString()
  @IsNotEmpty()
  taskTitle: string;
  @IsUUID()
  @IsNotEmpty()
  createdByUserId: string;
  @IsOptional()
  @IsArray()
  assigneesId: string;
  @IsDate()
  createdAt: Date;
}
