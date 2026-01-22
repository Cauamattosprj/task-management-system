import { useEffect, useState } from "react";
import {
  TaskAssignUsersCombobox,
  type User,
} from "@components/task/task-assign-users-combobox";
import { TaskDeadlinePicker } from "@components/task/task-deadline-picker";
import { Button } from "@components/ui/button";
import { TaskStatusCombobox } from "@components/task/task-status-combobox";
import { TaskPriorityCombobox } from "@components/task/task-priority-combobox";
import { cn } from "@/lib/utils";
import { updateTask } from "@/lib/fetch/crud/task/update-task";
import type { TaskDTO } from "@/types/task.dto";
import type { UserDTO } from "@/types/user.dto";
import { getUserById } from "@/lib/fetch/crud/user/get-user-by-id";
import UserAvatar from "@components/users/user-avatar";
import TaskPriorityEnum from "@enums/task/TaskPriorityEnum";
import TaskStatusEnum from "@enums/task/TaskStatusEnum";
import { useUiState } from "@/store/ui-state.store";

export function TaskSidebar({ open, task }: { open: boolean; task: TaskDTO }) {
  const uiState = useUiState.getState();
  const [assignedUsers, setAssignedUsers] = useState<UserDTO[]>([]);
  const [status, setStatus] = useState<TaskPriorityEnum | undefined>(
    task.status,
  );
  const [priority, setPriority] = useState<TaskPriorityEnum | undefined>(
    task.priority,
  );
  const [deadline, setDeadline] = useState<TaskStatusPriority | undefined>(
    task.deadline,
  );
  const [taskCreator, setTaskCreator] = useState<UserDTO>();

  useEffect(() => {
    const users: UserDTO[] = [];
    async function fetchUsers() {
      if (task.assignedUsersIds) {
        console.log("task.assignedUserIds", task.assignedUsersIds);
        for (const userId of task.assignedUsersIds) {
          console.log("userId consultado:", userId);
          const user = await getUserById(userId);
          users.push(user);
        }
        setAssignedUsers(users);
      }
      const createdByUser = await getUserById(task.createdBy);
      console.log("created by", createdByUser);
      setTaskCreator(createdByUser);
      uiState.setIsLoading(false);
    }

    fetchUsers();
  }, []);

  function handleStatusChange(status: TaskStatusEnum) {
    setStatus(status);
    updateTask(task.id, { status });
  }

  function handleAssignedUsers(users: UserDTO[]) {
    console.log(
      "Usuarios:",
      users.map((task) => task.id),
    );
    setAssignedUsers(users);
    updateTask(task.id, {
      assignedUsersIds: users.map((task) => task.id),
    });
  }

  function handleDeadlineChange(deadline): (date: Date | undefined) => void {
    setDeadline(deadline);
    updateTask(task.id, { deadline });
  }

  function handlePriorityChange(priority): (priority: string) => void {
    setPriority(priority);
    updateTask(task.id, { priority });
  }

  if (uiState.isLoading) {
    return;
  }

  return (
    <div className="absolute md:relative z-0 flex justify-end h-full right-0">
      <div
        className={cn(
          "z-10 border-l p-4 bg-background",
          open ? "" : "hidden",
        )}
      >
        <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
          <span className="text-muted-foreground text-sm">Created By</span>
          <UserAvatar username={taskCreator.username} userProfilePhoto="#" />

          <span className="text-muted-foreground text-sm">Status</span>
          <TaskStatusCombobox
            value={status}
            onChange={(status) => handleStatusChange(status)}
          />

          <span className="text-muted-foreground text-sm">Priority</span>
          <TaskPriorityCombobox
            onChange={(priority) => handlePriorityChange(priority)}
            value={priority}
          />

          <span className="text-muted-foreground text-sm">Assignees</span>
          <TaskAssignUsersCombobox
            onChange={(users) => handleAssignedUsers(users)}
            value={assignedUsers}
          />

          <span className="text-muted-foreground text-sm">Deadline</span>
          <TaskDeadlinePicker
            onChange={handleDeadlineChange}
            value={deadline}
          />
        </div>
      </div>
    </div>
  );
}
