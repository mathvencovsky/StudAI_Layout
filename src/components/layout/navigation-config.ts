import {
  Home,
  Compass,
  Search,
  BookOpen,
  ClipboardCheck,
  Clock,
  Calendar,
  Target,
  RefreshCw,
  FileText,
  BarChart,
  Activity,
  Bookmark,
  Shield,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  to: string;
  icon: LucideIcon;
  label: string;
  requiresAuth: boolean;
  requiresRole?: "admin";
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: "PRINCIPAL",
    items: [
      { to: "/", icon: Home, label: "home", requiresAuth: true },
      { to: "/explore", icon: Compass, label: "tracks", requiresAuth: true },
      { to: "/search", icon: Search, label: "search", requiresAuth: true },
      { to: "/study", icon: BookOpen, label: "study", requiresAuth: true },
      {
        to: "/assessments",
        icon: ClipboardCheck,
        label: "assessments",
        requiresAuth: true,
      },
    ],
  },
  {
    label: "PROGRESSO",
    items: [
      { to: "/sessions", icon: Clock, label: "sessions", requiresAuth: true },
      {
        to: "/calendar",
        icon: Calendar,
        label: "calendar",
        requiresAuth: true,
      },
      {
        to: "/my-goal",
        icon: Target,
        label: "goal",
        requiresAuth: true,
      },
      {
        to: "/reviews",
        icon: RefreshCw,
        label: "reviews",
        requiresAuth: true,
      },
    ],
  },
  {
    label: "DADOS",
    items: [
      {
        to: "/reports",
        icon: FileText,
        label: "reports",
        requiresAuth: true,
      },
      {
        to: "/metrics",
        icon: BarChart,
        label: "metrics",
        requiresAuth: true,
      },
      {
        to: "/activity",
        icon: Activity,
        label: "activity",
        requiresAuth: true,
      },
    ],
  },
  {
    label: "CONFIG",
    items: [
      { to: "/saved", icon: Bookmark, label: "saved", requiresAuth: true },
      {
        to: "/admin",
        icon: Shield,
        label: "admin",
        requiresAuth: true,
        requiresRole: "admin",
      },
      {
        to: "/settings",
        icon: Settings,
        label: "settings",
        requiresAuth: true,
      },
    ],
  },
];
