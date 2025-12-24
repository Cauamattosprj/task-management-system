import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import type { TaskDTO } from "@/types/task.dto";
import { Separator } from "./ui/separator";

export default function TaskDetails({ task }: { task: TaskDTO }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  const debouncedUpdate = useCallback(
    debounce(async (id: string, field: any) => {
      console.log(id, field);
    }, 800),
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
    <div className="flex flex-col space-y-4">
      <div>
        <span className="text-sm text-muted-foreground">{task.id}</span>
        <Separator />
      </div>

      <input
        placeholder="Task title"
        className="text-lg w-full font-semibold focus-visible:outline-0"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />

      <textarea
        placeholder="The description of your task..."
        className="w-full focus-visible:outline-0"
        value={description}
        onChange={(e) => handleDescriptionChange(e.target.value)}
      />
    </div>
  );
}
