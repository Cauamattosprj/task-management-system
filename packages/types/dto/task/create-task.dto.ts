import { PickType } from "@nestjs/mapped-types";
import { TaskDTO } from "./task.dto";

export class CreateTaskDTO extends PickType(TaskDTO, [
  "title",
  "status",
  "priority",
  "description",
  "deadline",
]) {}
