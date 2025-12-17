import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";
import { Flag, SignalHigh, SignalLow, SignalMedium } from "lucide-react";

type IconSize = "sm" | "md" | "lg";

const iconSizeMap: Record<IconSize, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

const priorityIconMap = {
  LOW: SignalLow,
  MEDIUM: SignalMedium,
  HIGH: SignalHigh,
  URGENT: Flag,
} satisfies Record<TaskPriorityEnum, React.ElementType>;

export function handlePriorityIcons({
  priority,
  size = "md",
}: Readonly<{
  priority: TaskPriorityEnum;
  size?: IconSize;
}>) {
  const Icon = priorityIconMap[priority];

  return (
    <Icon
      size={iconSizeMap[size]}
      className={priority === "URGENT" ? "text-destructive" : undefined}
    />
  );
}
