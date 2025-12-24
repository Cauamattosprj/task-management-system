import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

const STATUS_SKELETON_COUNT = 4;
const TASKS_PER_STATUS = 4;

export default function CollapsibleTasksSectionSkeleton() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      {/* Header */}
      <div className="w-full border rounded-sm px-4 py-2 bg-linear-to-r from-gray-100 to-gray-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <Separator />

      {/* Status sections */}
      <ul className="flex w-full flex-col gap-2">
        {Array.from({ length: STATUS_SKELETON_COUNT }).map((_, statusIndex) => (
          <li key={statusIndex} className="flex flex-col gap-2">
            {/* Status header */}
            <div className="w-full border rounded-sm px-4 py-2 bg-linear-to-r from-gray-100 to-gray-50">
              <Skeleton className="h-4 w-full flex gap-4">
                <ChevronRight className="size-4 text-muted-foreground transition-transform" />
                <Skeleton className="h-4 w-32 bg-gray-300 flex gap-4" />
                <Skeleton className="h-4 w-8 bg-gray-300 flex gap-4" />
              </Skeleton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
