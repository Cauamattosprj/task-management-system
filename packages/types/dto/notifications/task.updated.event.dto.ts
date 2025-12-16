import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class TaskUpdatedEventDTO {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
  @IsString()
  @IsNotEmpty()
  taskTitle: string;
  @IsUUID()
  @IsNotEmpty()
  updatedByUserId: string;
  @IsOptional()
  @IsArray()
  assigneesId: string[];
  @IsDate()
  createdAt: Date;
}
