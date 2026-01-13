import { useState } from "react";
import { AssignUsersCombobox, type User } from "./assign-users-combobox";
import { TaskDeadlinePicker } from "./task-deadline-picker";
import { Button } from "./ui/button";
import { TaskStatusCombobox } from "./task-status-combobox";
import { TaskPriorityCombobox } from "./task-priority-combobox";
import { cn } from "@/lib/utils";

export function TaskSidebar({ open }: { open: boolean }) {
  const [assignedUsers, setAssignedUsers] = useState<User[]>();
  const [status, setStatus] = useState<TaskStatusEnum | undefined>();
  const [priority, setPriority] = useState<TaskStatusPriority | undefined>();
  const [deadline, setDeadline] = useState<TaskStatusPriority | undefined>();

  function handleStatusChange(status: TaskStatusEnum) {
    setStatus(status);
    console.log("Novo status:", status);
  }

  function handleDeadlineChange(deadline): (date: Date | undefined) => void {
    setDeadline(deadline)
  }

  function handlePriorityChange(priority): (priority: string) => void {
    setPriority(priority);
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
          <AssignUsersCombobox setAssignedUsers={setAssignedUsers}  />

          <span className="text-muted-foreground">Deadline</span>
          <TaskDeadlinePicker onChange={handleDeadlineChange} value={deadline} />
        </div>
      </div>
    </div>
  );
}
