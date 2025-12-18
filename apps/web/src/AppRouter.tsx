import { RouterProvider } from "@tanstack/react-router";
import { router } from "./main";
import { useAuth } from "@/store/auth.store";
import { useEffect } from "react";
import { SessionSkeleton } from "./components/session-skeleton";

export function AppRouter() {
  const auth = useAuth();
  const hydrate = useAuth((s) => s.hydrate);
  const isLoading = useAuth((s) => s.isLoading);

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
