import CollapsibleTasksSection from "@/components/collapsible-tasks-section";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Circle } from "lucide-react";

export const Route = createFileRoute("/_protected/platform/tasks")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <CollapsibleTasksSection />
    </div>
  );
}
