import CollapsibleTasksSection from "@/components/task/collapsible-tasks-section";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChevronRight, Circle } from "lucide-react";

export const Route = createFileRoute("/_protected/platform/tasks")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <CollapsibleTasksSection />
      <Outlet />
    </div>
  );
}
