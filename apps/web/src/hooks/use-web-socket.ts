import { useEffect } from "react";
import { socketManager } from "@/websocket/socket.manager";
import { useAuth } from "@/store/auth.store";

export function useWebSocket() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    socketManager.connect();

    return () => {
      socketManager.disconnect();
    };
  }, [isAuthenticated]);
}
