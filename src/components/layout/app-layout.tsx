import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useSignOut } from "@/hooks/use-sign-out";
import { useTranslation } from "react-i18next";
import {
  Menu,
  ChevronLeft,
  GraduationCap,
  Search,
  ChevronDown,
  User,
  LogOut,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { NavGroup } from "./nav-group";
import { navigationGroups } from "./navigation-config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FeedbackDialog } from "@/components/feedback/feedback-dialog";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeSelector } from "@/components/theme-selector";
import { useAiChatContext } from "@/contexts/ai-chat-context";
import { useAiIconVisible } from "@/contexts/ai-icon-context";
import { GlobalFooter } from "@/components/layout/global-footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: logOut } = useSignOut();
  const { t } = useTranslation();
  const { toggleChat, isOpen: isChatOpen } = useAiChatContext();
  const showAiIcon = useAiIconVisible();

  const handleSignOut = async () => {
    await logOut();
    navigate({ to: "/" });
  };

  const userName = user?.displayName ?? t("user");
  const userEmail = user?.email ?? "";
  const userAvatar = user?.photoURL ?? undefined;
  const userInitials = userName.charAt(0).toUpperCase();

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <nav className="flex flex-col gap-4 p-2">
      {navigationGroups.map((group) => (
        <NavGroup
          key={group.label}
          group={group}
          collapsed={collapsed}
          onNavigate={() => setMobileMenuOpen(false)}
        />
      ))}
      {/* Feedback button */}
      <div className="space-y-0.5">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {t("support") ?? "Support"}
          </p>
        )}
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full ${collapsed ? "justify-center" : ""}`}
        >
          <MessageCircle size={18} />
          {!collapsed && (
            <span className="text-sm">{t("send-feedback")}</span>
          )}
        </button>
      </div>
    </nav>
  );

  const UserFooter = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={`p-3 border-t ${collapsed ? "flex justify-center" : ""}`}>
      <div className={`flex items-center gap-3 ${collapsed ? "" : "px-2"}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-200 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b">
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-sm">StudAI</span>
              )}
            </Link>
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSidebarCollapsed(true)}
              >
                <ChevronLeft size={16} />
              </Button>
            )}
          </div>
          {sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 mt-2 w-full"
              onClick={() => setSidebarCollapsed(false)}
            >
              <Menu size={16} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <NavContent collapsed={sidebarCollapsed} />
        </div>

        {/* User Footer */}
        <UserFooter collapsed={sidebarCollapsed} />
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-3 border-b bg-card sticky top-0 z-40">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">StudAI</span>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 flex flex-col">
              <div className="p-3 border-b">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sm">StudAI</span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <NavContent />
              </div>
              <UserFooter />
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between gap-4 px-6 py-2.5 border-b bg-card sticky top-0 z-50">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("search") + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showAiIcon && (
              <Button
                variant={isChatOpen ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={toggleChat}
                aria-label={t("ai-chat-toggle")}
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                AI
              </Button>
            )}

            {/* User Dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-2 hover:bg-muted h-8"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{userName.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={5}
                collisionPadding={10}
                className="w-48 bg-popover border shadow-md p-0 z-[9999]"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-2 p-3 border-b">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {userEmail}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  <Link to="/profile">
                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{t("profile")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <LanguageSelector />
                  <ThemeSelector />
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("log-out")}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        {/* Global Footer */}
        <GlobalFooter />
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
