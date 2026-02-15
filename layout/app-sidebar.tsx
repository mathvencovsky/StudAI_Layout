import React from "react";
import {
  IconAdjustments,
  IconBooks,
  IconHeart,
  IconHome,
  IconInnerShadowTop,
  IconMessage,
  IconMessageCircle,
  IconRoute,
  IconSettings,
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

  const data = {
    user: {
      name: user?.displayName ?? undefined,
      email: user?.email ?? undefined,
      avatar: user?.photoURL ?? undefined,
    },
    userNav: [
      {
        title: t("learning-preferences"),
        onClick: () => {
          setOpen(false);
          setOpenMobile(false);
          navigate({ to: "/learning-preferences" });
        },
        icon: IconAdjustments,
      },
      { title: t("log-out"), onClick: onLogOut, separator: true },
    ],
    navMain: [
      {
        title: t("home"),
        onClick: () => {
          setOpen(false);
          setOpenMobile(false);
          navigate({ to: "/" });
        },
        icon: IconHome,
      },
      ...(isAdminUser
        ? [
            {
              title: t("chat"),
              onClick: () => {
                setOpen(false);
                setOpenMobile(false);
                navigate({ to: "/chat" });
              },
              icon: IconMessage,
            },
          ]
        : []),
      {
        title: t("tracks"),
        onClick: () => {
          setOpen(false);
          setOpenMobile(false);
          navigate({ to: "/track" });
        },
        icon: IconRoute,
      },
      {
        title: t("modules"),
        onClick: () => {
          setOpen(false);
          setOpenMobile(false);
          navigate({ to: "/module" });
        },
        icon: IconBooks,
      },
      {
        title: t("favourites"),
        onClick: () => {
          setOpen(false);
          setOpenMobile(false);
          navigate({ to: "/favourites" });
        },
        icon: IconHeart,
      },
    ],
    navSecondary: [
      {
        title: t("send-feedback"),
        onClick: () => {
          setIsFeedbackOpen(true);
        },
        icon: IconMessageCircle,
      },
      ...(isAdminUser
        ? [
            {
              title: t("manage-content"),
              onClick: () => {
                setOpen(false);
                setOpenMobile(false);
                navigate({ to: "/content" });
              },
              icon: IconSettings,
            },
          ]
        : []),
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
        <NavMain items={data.navMain} />
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
