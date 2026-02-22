import { type Icon } from "@tabler/icons-react";
import { useRouterState } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavMainItem {
  title: string;
  to?: string;
  onClick: () => void;
  icon?: Icon;
}

export interface NavMainProps {
  items: NavMainItem[];
  label?: string;
}

/**
 * Primary navigation group for the sidebar.
 */
export function NavMain({ items, label }: NavMainProps) {
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActive = (to?: string) => {
    if (!to) return false;
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} onClick={item.onClick}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive(item.to)}
                className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
