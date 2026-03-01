import React from "react";
import {
  IconActivity,
  IconAdjustments,
  IconBook,
  IconBooks,
  IconChartBar,
  IconFileText,
  IconHeart,
  IconHome,
  IconInnerShadowTop,
  IconMessage,
  IconMessageCircle,
  IconRoute,
  IconSearch,
  IconSettings,
  IconShield,
} from "@tabler/icons-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSignOut } from "@/hooks/use-sign-out";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { FeedbackDialog } from "@/components/feedback/feedback-dialog";
import { useTranslation } from "react-i18next";

/**
 * Main application sidebar with navigation, user menu, and feedback dialog.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { mutateAsync: logOut } = useSignOut();
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  const { isAdmin: isAdminUser } = useIsAdminUser();

  const onLogOut = React.useCallback(async () => {
    await logOut();
    navigate({ to: "/" });
  }, [logOut, navigate]);

  const closeSidebar = React.useCallback(() => {
    setOpen(false);
    setOpenMobile(false);
  }, [setOpen, setOpenMobile]);

  const navigateTo = React.useCallback(
    (to: string) => () => {
      closeSidebar();
      navigate({ to });
    },
    [closeSidebar, navigate],
  );

  const data = {
    user: {
      name: user?.displayName ?? undefined,
      email: user?.email ?? undefined,
      avatar: user?.photoURL ?? undefined,
    },
    userNav: [
      {
        title: t("learning-preferences"),
        onClick: navigateTo("/learning-preferences"),
        icon: IconAdjustments,
      },
      { title: t("log-out"), onClick: onLogOut, separator: true },
    ],
    navMain: [
      { title: t("home"), to: "/", onClick: navigateTo("/"), icon: IconHome },
      // { title: t("explore"), to: "/explore", onClick: navigateTo("/explore"), icon: IconCompass },
      {
        title: t("search"),
        to: "/search",
        onClick: navigateTo("/search"),
        icon: IconSearch,
      },
      {
        title: t("study"),
        to: "/study",
        onClick: navigateTo("/study"),
        icon: IconBook,
      },
      {
        title: t("tracks"),
        to: "/track",
        onClick: navigateTo("/track"),
        icon: IconRoute,
      },
      {
        title: t("modules"),
        to: "/module",
        onClick: navigateTo("/module"),
        icon: IconBooks,
      },
      // {
      //   title: t("assessments"),
      //   to: "/assessments",
      //   onClick: navigateTo("/assessments"),
      //   icon: IconClipboardCheck,
      // },
    ],
    navAdmin: isAdminUser
      ? [
          {
            title: t("chat"),
            to: "/chat",
            onClick: navigateTo("/chat"),
            icon: IconMessage,
          },
          {
            title: t("manage-content"),
            to: "/content",
            onClick: navigateTo("/content"),
            icon: IconSettings,
          },
          {
            title: t("admin"),
            to: "/admin",
            onClick: navigateTo("/admin"),
            icon: IconShield,
          },
        ]
      : [],
    // navProgress: [
    //   {
    //     title: t("sessions"),
    //     to: "/sessions",
    //     onClick: navigateTo("/sessions"),
    //     icon: IconClock,
    //   },
    //   {
    //     title: t("calendar"),
    //     to: "/calendar",
    //     onClick: navigateTo("/calendar"),
    //     icon: IconCalendar,
    //   },
    //   {
    //     title: t("goal"),
    //     to: "/my-goal",
    //     onClick: navigateTo("/my-goal"),
    //     icon: IconTarget,
    //   },
    //   {
    //     title: t("reviews"),
    //     to: "/reviews",
    //     onClick: navigateTo("/reviews"),
    //     icon: IconRefresh,
    //   },
    // ],
    navData: [
      {
        title: t("reports"),
        to: "/reports",
        onClick: navigateTo("/reports"),
        icon: IconFileText,
      },
      {
        title: t("metrics"),
        to: "/metrics",
        onClick: navigateTo("/metrics"),
        icon: IconChartBar,
      },
      {
        title: t("activity"),
        to: "/activity",
        onClick: navigateTo("/activity"),
        icon: IconActivity,
      },
    ],
    navConfig: [
      {
        title: t("favourites"),
        to: "/favourites",
        onClick: navigateTo("/favourites"),
        icon: IconHeart,
      },
      {
        title: t("settings"),
        to: "/settings",
        onClick: navigateTo("/settings"),
        icon: IconSettings,
      },
    ],
    navSecondary: [
      {
        title: t("send-feedback"),
        onClick: () => setIsFeedbackOpen(true),
        icon: IconMessageCircle,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Stud AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label={t("nav-main")} />
        {/* <NavMain items={data.navProgress} label={t("nav-progress")} /> */}
        <NavMain items={data.navData} label={t("nav-data")} />
        <NavMain items={data.navConfig} label={t("nav-config")} />
        {isAdminUser && (
          <NavMain items={data.navAdmin} label={t("nav-admin")} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} items={data.userNav} />
      </SidebarFooter>
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </Sidebar>
  );
}
