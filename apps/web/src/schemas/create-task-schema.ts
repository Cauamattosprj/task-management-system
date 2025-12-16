import { z } from "zod";
import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";
import TaskStatusEnum from "@shared/types/enums/task/TaskStatusEnum";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.nativeEnum(TaskPriorityEnum),
  status: z.nativeEnum(TaskStatusEnum),
  assignedUsers: z.array(z.string()).min(1, "Select at least one user"),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
