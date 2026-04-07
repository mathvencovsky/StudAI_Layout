import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Home, Search, BookOpen, Route, MessageSquare,
  Settings, User, BarChart2, Heart, Plus, GraduationCap, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_COMMANDS = [
  { id: "home",       label: "Início",                    icon: Home,          to: "/" },
  { id: "search",     label: "Pesquisar",                 icon: Search,        to: "/search" },
  { id: "tracks",     label: "Trilhas",                   icon: Route,         to: "/track" },
  { id: "modules",    label: "Módulos",                   icon: BookOpen,      to: "/module" },
  { id: "chat",       label: "Chat com IA",               icon: MessageSquare, to: "/chat" },
  { id: "profile",    label: "Perfil",                    icon: User,          to: "/profile" },
  { id: "settings",   label: "Configurações",             icon: Settings,      to: "/settings" },
  { id: "reports",    label: "Relatórios",                icon: BarChart2,     to: "/reports" },
  { id: "saved",      label: "Salvos",                    icon: Heart,         to: "/saved" },
  { id: "new-track",  label: "Criar nova trilha com IA",  icon: Plus,          to: "/create-track" },
  { id: "learn-pref", label: "Editar preferências",       icon: GraduationCap, to: "/learning-preferences" },
];

/**
 * Global command palette — opens with Cmd+K / Ctrl+K.
 * Pure React, no cmdk dependency.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ALL_COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = useCallback((to: string) => {
    setOpen(false);
    setQuery("");
    void navigate({ to });
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) handleSelect(filtered[selected].to);
    if (e.key === "Escape") setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border bg-popover shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center border-b px-3 gap-2">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Para onde você quer ir?"
            className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.to)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-left transition-colors",
                    i === selected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onMouseEnter={() => setSelected(i)}
                >
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {item.label}
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t px-3 py-2 flex gap-3 text-[10px] text-muted-foreground">
          <span>↑↓ navegar</span>
          <span>↵ selecionar</span>
          <span>esc fechar</span>
        </div>
      </div>
    </div>
  );
}
