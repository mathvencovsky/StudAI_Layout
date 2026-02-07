import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAiChat } from "@/contexts/ai-chat-context";
import { useTranslation } from "react-i18next";

export interface SiteHeaderProps {}

export function SiteHeader({}: SiteHeaderProps) {
  const { toggleChat, isOpen } = useAiChat();
  const { t } = useTranslation();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumbs />
        <div className="ml-auto">
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon"
            onClick={toggleChat}
            aria-label={t("ai-chat-toggle")}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
