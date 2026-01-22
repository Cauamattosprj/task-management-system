"use client";

import * as React from "react";
import {
  Command,
  CheckSquare,
  Circle,
  LucideWine,
} from "lucide-react";


import { NavUser } from "@/components/nav/nav-user";
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
import { CreateTaskDialog } from "../task/create-task-dialog";



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



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
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
                <a href="/platform/tasks">
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
                            Math.max(5, Math.floor(Math.random() * 10) + 1),
                          ),
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
      <Sidebar collapsible="none" className="hidden flex-1 md:flex md:max-w-[250px]">
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
