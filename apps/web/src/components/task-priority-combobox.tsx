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

import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";

const PRIORITY_OPTIONS = [
  { label: "Low", value: TaskPriorityEnum.LOW },
  { label: "Medium", value: TaskPriorityEnum.MEDIUM },
  { label: "High", value: TaskPriorityEnum.HIGH },
  { label: "Urgent", value: TaskPriorityEnum.URGENT },
];

export function TaskPriorityCombobox({
  value,
  onChange,
  trigger,
}: Readonly<{
  trigger?: React.ReactNode;
  value?: TaskPriorityEnum;
  onChange: (priority: TaskPriorityEnum) => void;
}>) {
  const [open, setOpen] = useState(false);

  const selected = PRIORITY_OPTIONS.find((p) => p.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[240px] justify-between"
          >
            {selected ? selected.label : "Select priority"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No priority found.</CommandEmpty>
            <CommandGroup>
              {PRIORITY_OPTIONS.map((priority) => (
                <CommandItem
                  key={priority.value}
                  value={priority.value}
                  onSelect={() => {
                    console.log({
                      value: priority.value,
                      priorityvalue: priority.value,
                    });
                    value = priority.value;
                    onChange(priority.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === priority.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {priority.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
