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
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/store/auth.store";
import type { UserDTO } from "@/types/user.dto";

const { allUsers } = useAuth.getState();

export type User = { id: string; name: string };

export function AssignUsersCombobox({
  trigger,
  onChange,
  value = [],
}: {
  trigger?: React.ReactNode;
  onChange: (users: UserDTO | UserDTO[]) => void;
  value: UserDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserDTO[]>(value);

  const isSelected = (id: string) => selectedUsers.some((u) => u.id === id);

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
            {value.length > 0
              ? `${value.length} user(s) selected`
              : "Select users"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {allUsers != null
                ? allUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                          const updated = isSelected(user.id)
                            ? value.filter((u) => u.id !== user.id)
                            : [...value, user];

                          onChange(updated);
                          return updated;
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(user.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.username}
                    </CommandItem>
                  ))
                : ""}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
