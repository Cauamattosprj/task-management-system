import { useEffect, useState } from "react";
import { AssignUsersCombobox, type User } from "./assign-users-combobox";
import { TaskDeadlinePicker } from "./task-deadline-picker";
import { Button } from "./ui/button";
import { TaskStatusCombobox } from "./task-status-combobox";
import { TaskPriorityCombobox } from "./task-priority-combobox";
import { cn } from "@/lib/utils";
import { updateTask } from "@/lib/fetch/crud/task/update-task";
import type { TaskDTO } from "@/types/task.dto";
import type { UserDTO } from "@/types/user.dto";
import { getUserById } from "@/lib/fetch/crud/user/get-user-by-id";

export function TaskSidebar({ open, task }: { open: boolean; task: TaskDTO }) {
  const [assignedUsers, setAssignedUsers] = useState<UserDTO[]>([]);
  const [status, setStatus] = useState<TaskStatusEnum | undefined>(task.status);
  const [priority, setPriority] = useState<TaskStatusPriority | undefined>(
    task.priority
  );
  const [deadline, setDeadline] = useState<TaskStatusPriority | undefined>(
    task.deadline
  );

  useEffect(() => {
    const users: UserDTO[] = [];
    async function fetchUsers() {
      if (task.assignedUsersIds) {
        console.log('task.assignedUserIds', task.assignedUsersIds)
        for (const userId of task.assignedUsersIds) {
          console.log("userId consultado:", userId)
          const user = await getUserById(userId);
          users.push(user);
        }
        setAssignedUsers(users);
      }
    }

    fetchUsers();
  }, []);

  function handleStatusChange(status: TaskStatusEnum) {
    setStatus(status);
    updateTask(task.id, { status });
  }

  function handleAssignedUsers(users: UserDTO[]) {
    console.log("Usuarios:", users.map((task) => task.id))
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

  return (
    <div className="absolute z-0 flex justify-end h-full right-0">
      <div
        className={cn(
          "z-10 border-l p-4 bg-background shadow-2xl",
          open ? "" : "hidden"
        )}
      >
        <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
          <span className="text-muted-foreground">Status</span>
          <TaskStatusCombobox
            value={status}
            onChange={(status) => handleStatusChange(status)}
          />

          <span className="text-muted-foreground">Priority</span>
          <TaskPriorityCombobox
            onChange={(priority) => handlePriorityChange(priority)}
            value={priority}
          />

          <span className="text-muted-foreground">Created By</span>
          <Button variant="ghost" className="w-full justify-start">
            Exemplo
          </Button>

          <span className="text-muted-foreground">Assignees</span>
          <AssignUsersCombobox
            onChange={(users) => handleAssignedUsers(users)}
            value={assignedUsers}
          />

          <span className="text-muted-foreground">Deadline</span>
          <TaskDeadlinePicker
            onChange={handleDeadlineChange}
            value={deadline}
          />
        </div>
      </div>
    </div>
  );
}
