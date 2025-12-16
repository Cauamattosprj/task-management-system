import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class TaskCommentCreatedEventDTO {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  comment: string;
  @IsDate()
  createdAt: Date;
}
