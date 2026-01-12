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

const { allUsers } = useAuth.getState();

type User = { id: string; name: string };

export function AssignUsersCombobox({
  trigger,
  setAssignedUsers,
}: {
  trigger?: React.ReactNode;
  setAssignedUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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
            {selectedUsers.length > 0
              ? `${selectedUsers.length} user(s) selected`
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
                        setSelectedUsers((prev) => {
                          const updated = isSelected(user.id)
                            ? prev.filter((u) => u.id !== user.id)
                            : [...prev, user];

                          setAssignedUsers(updated);
                          return updated;
                        });
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
