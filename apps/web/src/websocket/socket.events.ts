import type { TaskDTO } from "@/types/task.dto";

export interface ServerToClientEvents {
  'task:created': (task: TaskDTO) => void;
  'task:updated': (task: TaskDTO) => void;
  'comment:new': (payload: { id: string }) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}
