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
import { getInitialsFromUserName, handleStatusIcon } from "./app-sidebar";
import { handlePriorityIcons } from "@/lib/handle-icons/handle-priority-icons";

export const tasks = [
  {
    id: crypto.randomUUID(),
    title: "Criar front-end",
    description: "Implementar layout com Shadcn UI",
    deadline: "2025-12-10T03:00:00.000Z",
    priority: "URGENT",
    status: "IN_PROGRESS",
    assignedUsers: [
      { id: "1", name: "React" },
      { id: "2", name: "Next.js" },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Ajustar autenticação",
    description: "Refatorar fluxo de JWT e refresh token",
    deadline: "2025-12-12T03:00:00.000Z",
    priority: "HIGH",
    status: "TODO",
    assignedUsers: [{ id: "3", name: "NestJS" }],
  },
  {
    id: crypto.randomUUID(),
    title: "Criar dashboard",
    description: "Adicionar gráficos de métricas",
    deadline: "2025-12-15T03:00:00.000Z",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    assignedUsers: [
      { id: "4", name: "Recharts" },
      { id: "5", name: "Grafana" },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Configurar CI/CD",
    description: "Pipeline com GitHub Actions",
    deadline: "2025-12-18T03:00:00.000Z",
    priority: "HIGH",
    status: "TODO",
    assignedUsers: [{ id: "6", name: "DevOps" }],
  },
  {
    id: crypto.randomUUID(),
    title: "Revisar permissões",
    description: "Ajustar RBAC por perfil",
    deadline: "2025-12-20T03:00:00.000Z",
    priority: "MEDIUM",
    status: "DONE",
    assignedUsers: [{ id: "7", name: "Security" }],
  },

  // ---- repetição com variação real ----

  ...Array.from({ length: 45 }).map((_, i) => ({
    id: crypto.randomUUID(),
    title: `Tarefa ${i + 6}`,
    description: `Descrição da tarefa ${i + 6}`,
    deadline: new Date(2025, 11, (i % 28) + 1).toISOString(),
    priority: ["LOW", "MEDIUM", "HIGH", "URGENT"][i % 4],
    status: ["TODO", "IN_PROGRESS", "DONE", "REVIEW"][i % 3],
    assignedUsers: [
      {
        id: crypto.randomUUID(),
        name: ["João", "Pedro", "José", "Joséda", "Maria"][i % 5],
      },
      ...(i % 2 === 0
        ? [
            {
              id: crypto.randomUUID(),
              name: ["João", "José", "Maria"][i % 3],
            },
          ]
        : []),
    ],
  })),
];

const tasksByStatus = tasks.reduce<Record<TaskStatusEnum, typeof tasks>>(
  (acc, task) => {
    acc[task.status].push(task);
    return acc;
  },
  {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
    REVIEW: [],
  }
);

const CollapsibleTasksSection = () => {
  const taskStatuses = Object.values(TaskStatusEnum).map((status) => status);

  return (
    <ul className="flex w-full flex-col gap-2">
      {taskStatuses.map((status) => (
        <Collapsible key={status} asChild>
          <li className="flex flex-col">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4">
              <div className="w-full border rounded-sm [[data-state=open]_&]:rounded-b-none px-4 py-2 bg-linear-to-r from-gray-100 to-gray-50">
                <div className="flex gap-4 items-center">
                  <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
                  <div className="flex gap-2 items-center font-semibold">
                    {handleStatusIcon(status)}
                    <span className="text-sm text-foreground">{status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">{}</span>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="">
              {tasksByStatus[status].map((task) => (
                <div
                  key={task.id}
                  className="flex flex-row gap-4 px-4 py-2 justify-between text-sm overflow-x-auto border-x border-b"
                >
                  <div className="w-8 text-left">
                    {handlePriorityIcons({
                      priority: task.priority,
                      size: "md",
                    })}
                  </div>
                  <div className="truncate w-16 text-left text-muted-foreground">
                    {task.id}
                  </div>
                  <div className="truncate w-32 text-left">{task.title}</div>
                  <div className="truncate w-8 text-left">
                    {handleStatusIcon(task.status)}
                  </div>
                  <div className="truncate w-32 text-left flex gap-2 items-center border-l pl-4 justify-between">
                    <div className="text-muted-foreground text-xs">
                      {new Date(task.deadline).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="truncate text-left">
                      <Avatar className="size-6">
                        <AvatarImage src="htts://github.com/shadcn.png" />
                        <AvatarFallback>
                          <span>{getInitialsFromUserName("TODO")}</span>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </li>
        </Collapsible>
      ))}
    </ul>
  );
};

export default CollapsibleTasksSection;
