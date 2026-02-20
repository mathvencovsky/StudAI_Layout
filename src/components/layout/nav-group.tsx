import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import type { NavigationGroup } from "./navigation-config";

interface NavGroupProps {
  group: NavigationGroup;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function NavGroup({ group, collapsed = false, onNavigate }: NavGroupProps) {
  const { t } = useTranslation();
  const { isAdmin } = useIsAdminUser();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Filtra items baseado em permissões
  const visibleItems = group.items.filter((item) => {
    if (item.requiresRole === "admin") {
      return isAdmin;
    }
    return true;
  });

  if (visibleItems.length === 0) return null;

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {t(group.label.toLowerCase())}
        </p>
      )}
      {visibleItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${
            collapsed ? "justify-center" : ""
          } ${
            isActive(item.to)
              ? "bg-primary/10 text-primary font-medium"
              : ""
          }`}
        >
          <item.icon size={18} />
          {!collapsed && <span className="text-sm">{t(item.label)}</span>}
        </Link>
      ))}
    </div>
  );
}
