import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { useAiChatContext } from "@/contexts/ai-chat-context";
import { useAiIconVisible } from "@/contexts/ai-icon-context";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const { toggleChat, isOpen } = useAiChatContext();
  const showAiIcon = useAiIconVisible();
  const { t } = useTranslation();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <AppBreadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          {/* Cmd+K hint — clicking also opens the palette */}
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-muted/50 hover:bg-muted transition-colors text-xs text-muted-foreground"
          >
            <Search className="h-3 w-3" />
            <span>Buscar</span>
            <kbd className="ml-1 pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[10px] font-medium opacity-70">
              ⌘K
            </kbd>
          </button>
          {showAiIcon && (
            <Button
              variant={isOpen ? "default" : "outline"}
              size="icon"
              onClick={toggleChat}
              aria-label={t("ai-chat-toggle")}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
