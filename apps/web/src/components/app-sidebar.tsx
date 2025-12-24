"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  CheckSquare,
  Plus,
  CircleDashed,
  SignalLow,
  Calendar,
  Users,
  Circle,
  ChevronsUpDownIcon,
  LucideWine,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  type CreateTaskFormData,
} from "@/schemas/create-task-schema";
import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";
import TaskStatusEnum from "@shared/types/enums/task/TaskPriorityEnum";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import { ParseStatus, z } from "zod";
import { Separator } from "./ui/separator";
import { AssignUsersCombobox } from "./assign-users-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskStatusCombobox } from "./task-status-combobox";
import { TaskPriorityCombobox } from "./task-priority-combobox";
import { TaskDeadlinePicker } from "./task-deadline-picker";
import { createTask } from "@/lib/fetch/crud/task/create-task";
import { useTasksStore } from "@/store/tasks.store";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tasks",
      url: "#",
      icon: CheckSquare,
      isActive: true,
    },
  ],
};

export function handleStatusLabel(status: any): React.ReactNode {
  switch (status) {
    case "TODO":
      return "To-Do";
    case "IN_PROGRESS":
      return "In progress";
    case "REVIEW":
      return "Review";
    case "DONE":
      return "Done";
  }
}

export function handleStatusIcon(status: any): React.ReactNode {
  switch (status) {
    case "TODO":
      return <Circle className="text-gray-600 size-4" />;
    case "IN_PROGRESS":
      return <Circle className="text-yellow-600 size-4" />;
    case "REVIEW":
      return <Circle className="text-blue-600 size-4" />;
    case "DONE":
      return <Circle className="text-green-600 size-4" />;
  }
}

export function getInitialsFromUserName(name: string): React.ReactNode {
  console.log("getInitialsFromUserName: ", name);
  const parts = name.split(" ");
  if (parts.length > 1) {
    const firstNameInitial = parts[0][0];
    const secondNameInitial = parts[1][0];
    return firstNameInitial + secondNameInitial;
  }

  return parts[0][0] + parts[0][1];
}

export function CreateTaskDialog() {
  const [assignedUsers, setAssignedUsers] = React.useState<
    { name: string; id: string }[] | undefined
  >(undefined);
  const [status, setStatus] = React.useState<TaskStatusEnum>();
  const [priority, setPriority] = React.useState<TaskPriorityEnum>();
  const [createTaskDialogOpen, setCreateTaskDialogOpen] =
    React.useState<boolean>(false);

  const hasAssignedUsers = assignedUsers && assignedUsers.length > 0;
  const hasMultipleUsers = assignedUsers && assignedUsers.length > 1;

  const tasksState = useTasksStore();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: TaskPriorityEnum.MEDIUM,
      status: TaskStatusEnum.TODO,
      assignedUsersIds: [],
    },
  });

  async function onSubmit(data: CreateTaskFormData) {
    console.log("Create task payload:", data);
    const res = await createTask(data);
    setCreateTaskDialogOpen(!createTaskDialogOpen);
    await tasksState.loadAllTasks();
  }

  return (
    <Dialog
      open={createTaskDialogOpen}
      onOpenChange={() => setCreateTaskDialogOpen(!createTaskDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="justify-start gap-2">
          <Plus size={16} />
          New task
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[70vw] !max-w-none max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">New Task</DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* TITLE */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <input
                  {...field}
                  id={field.name}
                  placeholder="Task title"
                  aria-invalid={fieldState.invalid}
                  className="text-lg font-semibold placeholder:focus-visible:text-muted-foreground focus-visible:outline-0 "
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* DESCRIPTION */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <textarea
                  {...field}
                  id="task-description"
                  placeholder="The description of your task..."
                  aria-invalid={fieldState.invalid}
                  className="min-h-[200px] placeholder:focus-visible:text-muted-foreground focus-visible:outline-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-4 gap-x-2 gap-y-2 justify-between">
            {/* DEADLINE */}
            <Controller
              name="deadline"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <TaskDeadlinePicker
                    value={field.value}
                    onChange={field.onChange}
                    trigger={
                      <Button
                        variant="outline"
                        type="button"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString()
                        ) : (
                          <span>Deadline</span>
                        )}
                      </Button>
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* PRIORITY */}
            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <TaskPriorityCombobox
                    value={priority}
                    onChange={(priority) => {
                      console.log(priority);
                      setPriority(priority);
                      field.onChange(priority);
                    }}
                  />
                </Field>
              )}
            />

            {/* STATUS */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <TaskStatusCombobox
                    value={status}
                    onChange={(status) => {
                      setStatus(status);
                      field.onChange(status);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ASSIGNED USERS */}
            <Controller
              name="assignedUsersIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <AssignUsersCombobox
                    trigger={
                      <Button
                        {...field}
                        id="assignedUsersIds"
                        aria-invalid={fieldState.invalid}
                        size={"icon"}
                        variant={"outline"}
                        type="button"
                      >
                        {!hasAssignedUsers && (
                          <div className="flex gap-2 items-center">
                            <Users />
                            <span>Assignee users</span>
                          </div>
                        )}

                        {hasAssignedUsers && hasMultipleUsers && (
                          <div>
                            <div className="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-2">
                              {assignedUsers.map((user) => (
                                <Avatar className="size-6">
                                  <AvatarImage src="htts://github.com/shadcn.png" />
                                  <AvatarFallback>
                                    <span>
                                      {getInitialsFromUserName(user.name)}
                                    </span>
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        )}

                        {hasAssignedUsers && !hasMultipleUsers && (
                          <div className="flex gap-2 items-center">
                            <Avatar>
                              <AvatarImage src="htts://github.com/shadcn.png" />
                              <AvatarFallback>
                                <span>
                                  {getInitialsFromUserName(
                                    assignedUsers[0].name
                                  )}
                                </span>
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignedUsers[0].name}</span>
                          </div>
                        )}
                      </Button>
                    }
                    setAssignedUsers={(users) => {
                      setAssignedUsers(users);
                      const ids = users?.map((u) => u.id) ?? [];

                      field.onChange(ids);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            Create task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        const mail = data.mails.sort(() => Math.random() - 0.5);
                        setMails(
                          mail.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1)
                          )
                        );
                        setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />

          <CreateTaskDialog />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              {/* {mails.map((mail) => (
                <a
                  href="#"
                  key={mail.email}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.name}</span>{" "}
                    <span className="ml-auto text-xs">{mail.date}</span>
                  </div>
                  <span className="font-medium">{mail.subject}</span>
                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    {mail.teaser}
                  </span>
                </a>
              ))} */}
              <div className="flex flex-col gap-2 text-center justify-center items-center">
                <div className="flex flex-col">
                  <span>
                    Your tasks notifications will be displayed here soon
                  </span>
                  <span className="text-muted-foreground">
                    In our next updates these feature will be available
                  </span>
                </div>
                <div className="bg-muted rounded-full text-muted-foreground border border-muted-foreground p-2">
                  <LucideWine />
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
