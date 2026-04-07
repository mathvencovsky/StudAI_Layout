import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Home, Search, BookOpen, Route, MessageSquare,
  Settings, User, BarChart2, Heart, Plus, GraduationCap,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const COMMANDS = [
  { group: "Navegação", items: [
    { id: "home",     label: "Início",              icon: Home,          to: "/" },
    { id: "search",   label: "Pesquisar",            icon: Search,        to: "/search" },
    { id: "tracks",   label: "Trilhas",              icon: Route,         to: "/track" },
    { id: "modules",  label: "Módulos",              icon: BookOpen,      to: "/module" },
    { id: "chat",     label: "Chat com IA",          icon: MessageSquare, to: "/chat" },
    { id: "profile",  label: "Perfil",               icon: User,          to: "/profile" },
    { id: "settings", label: "Configurações",        icon: Settings,      to: "/settings" },
    { id: "reports",  label: "Relatórios",           icon: BarChart2,     to: "/reports" },
    { id: "saved",    label: "Salvos",               icon: Heart,         to: "/saved" },
  ]},
  { group: "Ações", items: [
    { id: "new-track",  label: "Criar nova trilha com IA", icon: Plus,           to: "/create-track" },
    { id: "learn-pref", label: "Editar preferências",      icon: GraduationCap,  to: "/learning-preferences" },
  ]},
];

/**
 * Global command palette — opens with Cmd+K / Ctrl+K.
 * Inspired by Linear, Notion, Vercel.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((to: string) => {
    setOpen(false);
    void navigate({ to });
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Para onde você quer ir?" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {COMMANDS.map((group, gi) => (
          <div key={group.group}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={group.group}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => handleSelect(item.to)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
