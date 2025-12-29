import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import type { TaskDTO } from "@/types/task.dto";
import { Separator } from "./ui/separator";
import { updateTask } from "@/lib/fetch/crud/task/update-task";
import { Cloud, Check, CloudCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type UpdateStatus = "idle" | "saving" | "saved";

export default function TaskDetails({ task }: { task: TaskDTO }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");

  const debouncedUpdate = useCallback(
    debounce(async (id: string, field: any) => {
      setUpdateStatus("saving");
      console.log(id, field);
      const updated = await updateTask(id, field);
      console.log(updated);
      setTimeout(() => {
        setUpdateStatus("saved");
        setTimeout(() => {
          setUpdateStatus("idle");
        }, 1500);
      }, 1500);
    }, 1200),
    []
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
    <div className="flex flex-col h-full space-y-4">
      <div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{task.id}</span>
          <div className="relative w-6 h-6">
            <Cloud
              className={cn(
                "text-muted-foreground absolute opacity-100 inset-0 transition-all duration-500",
                updateStatus === "saving" && "opacity-100 animate-bounce",
                updateStatus === "saved" && "opacity-0"
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
        <Separator />
      </div>

      <div className="h-full p-6 space-y-4">
        <input
          placeholder="Task title"
          className="text-2xl w-full focus-visible:outline-0"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />

        <textarea
          placeholder="The description of your task..."
          className="w-full h-full resize-none focus-visible:outline-0"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}
