import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "./socket.events";

export function createSocket(
  token?: string
): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(import.meta.env.VITE_WS_URL, {
    transports: ["websocket"],
    autoConnect: false,
    auth: token ? { token } : undefined,
    withCredentials: true,
  });
}
