import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Home, Search, BookOpen, Route, MessageSquare,
  Settings, User, BarChart2, Heart, Plus, GraduationCap, X,
} from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

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
 * Uses cmdk directly without the Dialog wrapper to avoid import issues.
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
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((to: string) => {
    setOpen(false);
    void navigate({ to });
  }, [navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border bg-popover shadow-2xl overflow-hidden">
        <CommandPrimitive className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-2" />
            <CommandPrimitive.Input
              placeholder="Para onde você quer ir?"
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto p-2">
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </CommandPrimitive.Empty>
            {COMMANDS.map((group, gi) => (
              <CommandPrimitive.Group
                key={group.group}
                heading={group.group}
                className={cn(
                  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                  gi > 0 && "mt-2 pt-2 border-t"
                )}
              >
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandPrimitive.Item
                      key={item.id}
                      value={item.label}
                      onSelect={() => handleSelect(item.to)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </CommandPrimitive.Item>
                  );
                })}
              </CommandPrimitive.Group>
            ))}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </div>
    </div>
  );
}
