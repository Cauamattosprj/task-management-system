import { PartialType } from "@nestjs/mapped-types";
import { TaskDTO } from "./task.dto";

export class UpdateTaskDTO extends PartialType(TaskDTO) {}
