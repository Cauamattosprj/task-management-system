import { SessionSkeleton } from "@/components/session-skeleton";
import TaskDetails from "@/components/task-details";
import { getTaskById } from "@/lib/fetch/crud/task/get-task-by-id";
import type { TaskDTO } from "@/types/task.dto";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected/platform/task/$taskId")({
  loader: ({ params }) => getTaskById(params.taskId),
  component: RouteComponent,
});

function RouteComponent() {
  const [task, setTask] = useState<TaskDTO>();
  const { taskId } = Route.useParams();

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTaskById(taskId);
      setTask(task);
    };

    fetchTask();
  }, []);

  if (!task) {
    return <SessionSkeleton />;
  }

  return <TaskDetails task={task} />;
}
