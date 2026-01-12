import type { Socket } from "socket.io-client";
import { createSocket } from "./socket.client";
import { useAuth } from "@/store/auth.store";
import { useTasksStore } from "@/store/tasks.store";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "./socket.events";
import { toast } from "sonner";

class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;

  connect() {
    if (this.socket?.connected) return;

    const token = useAuth.getState().accessToken;

    this.socket = createSocket(token);

    this.registerCoreListeners();
    this.registerDomainListeners();

    this.socket.connect();
  }

  private registerCoreListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });
  }

  private registerDomainListeners() {
    if (!this.socket) return;

    const tasksStore = useTasksStore.getState();

    this.socket.on("task:created", (task) => {
      toast("Task created");
      tasksStore.loadAllTasks();
    });

    this.socket.on("task:updated", (task) => {
      console.log(task);
      toast("Task has been updated", {
        description: (
          <div className="flex items-center gap-2">
            <span>{task.title}</span>
            <span>{task.createdAt}</span>
          </div>
        ),
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    });

    this.socket.on("comment:new", ({ id }) => {
      toast("New comment");
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketManager = new SocketManager();
