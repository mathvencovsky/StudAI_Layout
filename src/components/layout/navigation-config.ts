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
      { to: "/explorar", icon: Compass, label: "tracks", requiresAuth: true },
      { to: "/pesquisar", icon: Search, label: "search", requiresAuth: true },
      { to: "/estudar", icon: BookOpen, label: "study", requiresAuth: true },
      {
        to: "/avaliacoes",
        icon: ClipboardCheck,
        label: "assessments",
        requiresAuth: true,
      },
    ],
  },
  {
    label: "PROGRESSO",
    items: [
      { to: "/sessoes", icon: Clock, label: "sessions", requiresAuth: true },
      {
        to: "/calendario",
        icon: Calendar,
        label: "calendar",
        requiresAuth: true,
      },
      {
        to: "/meu-objetivo",
        icon: Target,
        label: "goal",
        requiresAuth: true,
      },
      {
        to: "/revisoes",
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
        to: "/relatorios",
        icon: FileText,
        label: "reports",
        requiresAuth: true,
      },
      {
        to: "/metricas",
        icon: BarChart,
        label: "metrics",
        requiresAuth: true,
      },
      {
        to: "/atividade",
        icon: Activity,
        label: "activity",
        requiresAuth: true,
      },
    ],
  },
  {
    label: "CONFIG",
    items: [
      { to: "/salvos", icon: Bookmark, label: "saved", requiresAuth: true },
      {
        to: "/admin",
        icon: Shield,
        label: "admin",
        requiresAuth: true,
        requiresRole: "admin",
      },
      {
        to: "/configuracoes",
        icon: Settings,
        label: "settings",
        requiresAuth: true,
      },
    ],
  },
];
