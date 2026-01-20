import {
  ChevronRight,
  ChevronRightIcon,
  Circle,
  PanelsTopLeftIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TaskStatusEnum from "@shared/types/enums/task/TaskStatusEnum";
import { getInitialsFromUserName, handleStatusIcon } from "../nav/app-sidebar";
import { handlePriorityIcons } from "@/lib/handle-icons/handle-priority-icons";
import { fetchAllTasks } from "@/lib/fetch/crud/task/get-all-tasks";
import { useEffect, useMemo, useState } from "react";
import type { TaskDTO } from "@/types/task.dto";
import { Separator } from "../ui/separator";
import { useAuth } from "@/store/auth.store";
import { SessionSkeleton } from "../skeleton/session-skeleton";
import { useUiState } from "@/store/ui-state.store";
import CollapsibleTasksSectionSkeleton from "../skeleton/collapsible-tasks-section-skeleton";
import { useTasksStore } from "@/store/tasks.store";
import { getUserById } from "@/lib/fetch/crud/user/get-user-by-id";
import { useNavigate } from "@tanstack/react-router";

const CollapsibleTasksSection = () => {
  const uiState = useUiState();
  const tasksStore = useTasksStore();
  const authStore = useAuth();
  const navigate = useNavigate();
  const tasks = tasksStore.tasks;
  const totalTasks = tasks?.length;
  console.log(authStore.user);

  useEffect(() => {
    tasksStore.loadAllTasks();
  }, []);

  const tasksByStatus = useMemo(() => {
    return tasks.reduce<Record<TaskStatusEnum, TaskDTO[]>>(
      (acc, task: TaskDTO) => {
        acc[task.status].push(task);
        return acc;
      },
      {
        TODO: [],
        IN_PROGRESS: [],
        DONE: [],
        REVIEW: [],
      },
    );
  }, [tasks]);

  if (uiState.isLoading) {
    return <CollapsibleTasksSectionSkeleton />;
  }

  const taskStatuses = Object.values(TaskStatusEnum);

  return (
    <div className="flex flex-col space-y-4 base-padding">
      <div className="w-full border rounded-sm [[data-state=open]_&]:rounded-b-none px-4 py-2 bg-linear-to-r from-gray-200 to-gray-50">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center font-semibold">
            <span className="text-sm text-foreground">
              Total Tasks: {totalTasks}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">{}</span>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" />
      <ul className="flex w-full flex-col gap-2">
        {taskStatuses.map((status) => (
          <Collapsible key={status} asChild>
            <li className="flex flex-col">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4">
                <div className="w-full border rounded-sm [[data-state=open]_&]:rounded-b-none px-4 py-2 bg-linear-to-r from-gray-200 to-gray-50">
                  <div className="flex gap-4 items-center">
                    <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
                    <div className="flex gap-2 items-center font-semibold">
                      {handleStatusIcon(status)}
                      <span className="text-sm text-foreground">{status}</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksByStatus[status].length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">{}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="">
                {tasksByStatus[status].map((task: TaskDTO) => {
                  return (
                    <button
                      className="flex flex-row w-full gap-4 px-4 py-2 justify-between text-sm overflow-x-auto border-x border-b"
                      key={task.id}
                      onClick={() =>
                        navigate({
                          to: `/platform/task/$taskId`,
                          params: { taskId: task.id },
                        })
                      }
                    >
                      <div className="w-8 text-left">
                        {handlePriorityIcons({
                          priority: task.priority,
                          size: "lg",
                        })}
                      </div>
                      <div className="truncate w-64 text-left text-muted-foreground">
                        {task.id}
                      </div>
                      <div className="truncate w-64 text-left">
                        {task.title}
                      </div>
                      <div className="truncate w-8 text-left">
                        {handleStatusIcon(task.status)}
                      </div>
                      <div className="truncate w-32 text-left flex gap-2 items-center border-l pl-4 justify-between">
                        <div className="text-muted-foreground text-xs">
                          {new Date(task.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </div>
                        <div className="truncate text-left">
                          <Avatar className="size-6">
                            <AvatarImage src="htts://github.com/shadcn.png" />
                            <AvatarFallback>
                              <span>
                                {getInitialsFromUserName(
                                  authStore.allUsers?.find(
                                    (user) => user.id == task.createdBy,
                                  )?.username,
                                )}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CollapsibleContent>
            </li>
          </Collapsible>
        ))}
      </ul>
    </div>
  );
};

export default CollapsibleTasksSection;
