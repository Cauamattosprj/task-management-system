import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Command } from "lucide-react";

export function SessionSkeleton() {
  return (
    <div className="flex gap-4 flex-col min-h-svh items-center justify-center">
      <Skeleton className=" rounded-md bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center ">
        <div className="animate-spin ">
          <Command className="size-4" />
        </div>
      </Skeleton>
    </div>
  );
}
