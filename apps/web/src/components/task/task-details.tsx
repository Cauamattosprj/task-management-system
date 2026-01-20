import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import type { TaskDTO } from "@/types/task.dto";
import { Separator } from "@components/ui/separator";
import { updateTask } from "@/lib/fetch/crud/task/update-task";
import { Cloud, Check, CloudCheck, Sidebar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskSidebar } from "@components/task/task-sidebar";
import { SidebarProvider } from "@components/ui/sidebar";
import { Button } from "@components/ui/button";

type UpdateStatus = "idle" | "saving" | "saved";

export function TaskNavbar({
  task,
  updateStatus,
}: {
  task: TaskDTO;
  updateStatus: UpdateStatus;
}) {
  return (
    <div className="flex gap-4 justify-center items-center">
      <span className="text-sm text-muted-foreground">{task.id}</span>
      <div className="relative w-6 h-6">
        <Cloud
          className={cn(
            "text-muted-foreground absolute opacity-100 inset-0 transition-all duration-500",
            updateStatus === "saving" && "opacity-100 animate-bounce",
            updateStatus === "saved" && "opacity-0",
          )}
        />
        <CloudCheck
          className={cn(
            "absolute inset-0 transition-all duration-500 opacity-0 scale-100 text-green-500",
            updateStatus === "saved" && "opacity-100",
          )}
        />
      </div>
    </div>
  );
}

export default function TaskDetails({ task }: { task: TaskDTO }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const debouncedUpdate = useCallback(
    debounce(async (id: string, field: any) => {
      setUpdateStatus("saving");
      const updated = await updateTask(id, field);
      setTimeout(() => {
        setUpdateStatus("saved");
        setTimeout(() => {
          setUpdateStatus("idle");
        }, 1500);
      }, 1500);
    }, 1200),
    [],
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    debouncedUpdate(task.id, { title: value });
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);
    debouncedUpdate(task.id, { description: value });
  }

  return (
    <div className="h-full">
      <div>
        <div className="flex justify-between base-padding">
          <TaskNavbar updateStatus={updateStatus} task={task} />

          <div className="flex justify-center items-center gap-4">
            <button
              data-active={isSidebarOpen}
              className={cn("btn-icon-nav")}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Sidebar />
            </button>
          </div>
        </div>
        <Separator />
      </div>
      <div className="flex justify-between h-full relative">
        <div className="flex flex-col h-full space-y-4">
          <div className="h-full p-6 space-y-4">
            <input
              placeholder="Task title"
              className="text-2xl w-full focus-visible:outline-0"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <textarea
              placeholder="The description of your task..."
              className="w-full resize-none focus-visible:outline-0"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </div>
        </div>
        <TaskSidebar task={task} open={isSidebarOpen} />
      </div>
    </div>
  );
}
