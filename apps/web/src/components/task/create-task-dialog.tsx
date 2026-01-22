import * as React from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  type CreateTaskFormData,
} from "@/schemas/create-task-schema";
import TaskPriorityEnum from "@shared/types/enums/task/TaskPriorityEnum";
import TaskStatusEnum from "@shared/types/enums/task/TaskStatusEnum";
import { Field, FieldError } from "../ui/field";
import { Separator } from "../ui/separator";
import { TaskAssignUsersCombobox } from "@components/task/task-assign-users-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskStatusCombobox } from "@components/task/task-status-combobox";
import { TaskPriorityCombobox } from "@components/task/task-priority-combobox";
import { TaskDeadlinePicker } from "@components/task/task-deadline-picker";
import { createTask } from "@/lib/fetch/crud/task/create-task";
import { useTasksStore } from "@/store/tasks.store";
import { getInitialsFromUserName } from "../nav/app-sidebar";
import type { UserDTO } from "@dtos/user/user.dto";

export function CreateTaskDialog() {
  const [assignedUsers, setAssignedUsers] = React.useState<UserDTO[]>([]);
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
                  <TaskAssignUsersCombobox
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
                                      {getInitialsFromUserName(user.username)}
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
                                  {assignedUsers.length != undefined
                                    ? getInitialsFromUserName(
                                        assignedUsers[0].username,
                                      )
                                    : ""}
                                </span>
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignedUsers[0].username}</span>
                          </div>
                        )}
                      </Button>
                    }
                    onChange={(users) => {
                      setAssignedUsers(users);
                      const ids = users?.map((u) => u.id) ?? [];

                      field.onChange(ids);
                    }}
                    value={assignedUsers}
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
