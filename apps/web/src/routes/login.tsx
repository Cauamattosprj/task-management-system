import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({
        to: "/platform/tasks",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  return (
    <div className="flex flex-col">
      <span>Authenticated: {auth.isAuthenticated() ? "yes" : "no"} </span>
      <Button onClick={() => auth.signIn()}>Signin</Button>
    </div>
  );
}
