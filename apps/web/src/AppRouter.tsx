import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./lib/auth";
import { router } from "./main";

export function AppRouter() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}
