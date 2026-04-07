"use client";

import React from "react";
import { IconDotsVertical, IconUser, type Icon } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeSelector } from "@/components/theme-selector";

export interface NavUserProps {
  items: {
    title: string;
    onClick: () => void;
    icon?: Icon;
    separator?: boolean;
  }[];
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function NavUser({ user, items }: NavUserProps) {
  const { isMobile } = useSidebar();
  const initials = getInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* Profile header — clicking navigates to profile */}
            <DropdownMenuLabel className="p-0 font-normal">
              <button
                className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-accent rounded-md transition-colors"
                onClick={items.find((i) => i.icon === IconUser)?.onClick ?? items[0]?.onClick}
              >
                <Avatar className="h-9 w-9 rounded-lg flex-shrink-0">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <LanguageSelector />
              <ThemeSelector />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  {item.separator && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={item.onClick}>
                    {item.icon ? <item.icon className="mr-2 h-4 w-4" /> : null}
                    {item.title}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
