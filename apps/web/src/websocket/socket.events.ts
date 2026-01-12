import type { TaskDTO } from "@/types/task.dto";

export interface ServerToClientEvents {
  "task:created": (any) => void;
  "task:updated": (any) => void;
  "comment:new": (payload: { id: string }) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}
