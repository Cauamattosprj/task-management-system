import type { TaskDTO } from "@/types/task.dto";
import { ActivityIcon } from "lucide-react";

type TaskActivitySectionProps = {
  task: TaskDTO;
};

function ActivitySectionHeader({}) {
  return (
    <div className="flex gap-1">
      <ActivityIcon className="icon" />
      <span className="font-medium text-muted-foreground">Activity</span>
    </div>
  );
}

export default function TaskActivitySection({
  task,
}: TaskActivitySectionProps) {
  return (
    <div>
      <ActivitySectionHeader />
    </div>
  );
}
