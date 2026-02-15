import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useSignOut } from "@/hooks/use-sign-out";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Heart,
  MessageSquare,
  Settings,
  Menu,
  ChevronLeft,
  GraduationCap,
  Search,
  Plus,
  ChevronDown,
  User,
  HelpCircle,
  LogOut,
  MessageCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";
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

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: logOut } = useSignOut();
  const { isAdmin: isAdminUser } = useIsAdminUser();
  const { t } = useTranslation();
  const { toggleChat, isOpen: isChatOpen } = useAiChatContext();
  const showAiIcon = useAiIconVisible();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleSignOut = async () => {
    await logOut();
    navigate({ to: "/" });
  };

  const userName = user?.displayName ?? t("user");
  const userEmail = user?.email ?? "";
  const userAvatar = user?.photoURL ?? undefined;
  const userInitials = userName.charAt(0).toUpperCase();

  // Navigation sections
  const mainItems: NavItem[] = [
    { to: "/", icon: LayoutDashboard, label: t("home") },
    ...(isAdminUser
      ? [{ to: "/chat", icon: MessageSquare, label: t("chat") }]
      : []),
    { to: "/track", icon: Map, label: t("tracks") },
    { to: "/module", icon: BookOpen, label: t("modules") },
    { to: "/favourites", icon: Heart, label: t("favourites") },
  ];

  const secondaryItems: NavItem[] = [
    ...(isAdminUser
      ? [{ to: "/content", icon: Settings, label: t("manage-content") }]
      : []),
  ];

  const mobileNavItems: NavItem[] = [
    { to: "/", icon: LayoutDashboard, label: t("home") },
    { to: "/track", icon: Map, label: t("tracks") },
    { to: "/module", icon: BookOpen, label: t("modules") },
    { to: "/favourites", icon: Heart, label: t("favourites") },
    ...(isAdminUser
      ? [{ to: "/chat", icon: MessageSquare, label: t("chat") }]
      : []),
  ];

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  const NavSection = ({
    items,
    label,
    collapsed = false,
  }: {
    items: NavItem[];
    label: string;
    collapsed?: boolean;
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-0.5">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {label}
          </p>
        )}
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${collapsed ? "justify-center" : ""} ${
              isActive(item.to)
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }`}
          >
            <item.icon size={18} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        ))}
      </div>
    );
  };

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <nav className="flex flex-col gap-4 p-2">
      <NavSection
        items={mainItems}
        label={t("navigation") ?? "Navigation"}
        collapsed={collapsed}
      />
      {secondaryItems.length > 0 && (
        <NavSection
          items={secondaryItems}
          label={t("admin") ?? "Admin"}
          collapsed={collapsed}
        />
      )}
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
        <header className="hidden md:flex items-center justify-between gap-4 px-6 py-2.5 border-b bg-card sticky top-0 z-40">
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
            <DropdownMenu>
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
                className="w-48 bg-popover border shadow-md z-50 p-0"
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
                  <LanguageSelector />
                  <ThemeSelector />
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/learning-preferences" })
                    }
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{t("learning-preferences")}</span>
                  </DropdownMenuItem>
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

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around items-center py-1 px-1 z-40">
          {mobileNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors min-w-[48px] min-h-[44px] justify-center ${
                isActive(item.to) ? "text-primary" : ""
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
