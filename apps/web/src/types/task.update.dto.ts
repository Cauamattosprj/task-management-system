import TaskStatusEnum from "@shared/types/enums/task/TaskStatusEnum";
import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";

export interface UpdateTaskDTO {
  id?: string;

  createdBy?: string;

  title?: string;

  description?: string;

  deadline?: string;

  priority?: TaskPriorityEnum;

  status?: TaskStatusEnum;

  assignedUsersIds?: string[];

  commentIds?: string[];
}
