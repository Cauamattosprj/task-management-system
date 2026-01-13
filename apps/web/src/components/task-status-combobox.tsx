"use client";

import * as React from "react";
import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TaskStatusEnum from "@shared/types/enums/task/TaskStatusEnum";

const STATUS_OPTIONS = [
  { label: "To do", value: TaskStatusEnum.TODO },
  { label: "In progress", value: TaskStatusEnum.IN_PROGRESS },
  { label: "Review", value: TaskStatusEnum.REVIEW },
  { label: "Done", value: TaskStatusEnum.DONE },
];

export function TaskStatusCombobox({
  value,
  onChange,
  trigger,
}: {
  trigger?: React.ReactNode;
  value?: TaskStatusEnum;
  onChange: (status: TaskStatusEnum) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = STATUS_OPTIONS.find((s) => s.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className=" justify-between"
          >
            {selected ? selected.label : "Select status"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {STATUS_OPTIONS.map((status) => (
                <CommandItem
                  key={status.value}
                  onSelect={() => {
                    onChange(status.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
