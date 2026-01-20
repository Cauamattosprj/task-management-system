import { RouterProvider } from "@tanstack/react-router";
import { router } from "./main";
import { useAuth } from "@/store/auth.store";
import { useEffect } from "react";
import { SessionSkeleton } from "./components/skeleton/session-skeleton";
import { useWebSocket } from "./hooks/use-web-socket";

export function AppRouter() {
  const auth = useAuth();
  const hydrate = useAuth((s) => s.hydrate);
  const isLoading = useAuth((s) => s.isLoading);
  useWebSocket();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (isLoading) {
    return <SessionSkeleton />;
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated: auth.isAuthenticated,
          accessToken: auth.accessToken,
          user: auth.user,
        },
      }}
    />
  );
}
