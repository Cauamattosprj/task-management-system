import { useState } from "react";
import { AssignUsersCombobox } from "./assign-users-combobox";
import { TaskDeadlinePicker } from "./task-deadline-picker";
import { Button } from "./ui/button";
import { TaskStatusCombobox } from "./task-status-combobox";
import { TaskPriorityCombobox } from "./task-priority-combobox";

export function TaskSidebar() {
  const [assignedUsers, setAssignedUsers] = useState();
  function handleDeadlineChange(): (date: Date | undefined) => void {
    throw new Error("Function not implemented.");
  }

  function handleStatusChange(): (status) => void {
    throw new Error("Function not implemented.");
  }

  function handlePriorityChange(): (priority) => void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-1/3 h-full border-l p-4">
      <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
        <span className="text-muted-foreground">Status</span>
        <TaskStatusCombobox onChange={handleStatusChange} />

        <span className="text-muted-foreground">Priority</span>
        <TaskPriorityCombobox onChange={handlePriorityChange} />

        <span className="text-muted-foreground">Created By</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>

        <span className="text-muted-foreground">Assignees</span>
        <AssignUsersCombobox setAssignedUsers={setAssignedUsers} />

        <span className="text-muted-foreground">Deadline</span>
        <TaskDeadlinePicker onChange={handleDeadlineChange} />
      </div>
    </div>
  );
}
