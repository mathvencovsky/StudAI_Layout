import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: "admin";
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { isAdmin } = useIsAdminUser();
  const { t } = useTranslation();

  if (requiredRole === "admin" && !isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <ShieldAlert className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">{t("access-restricted")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("access-restricted-description")}
            </p>
            <Button asChild variant="outline">
              <Link to="/">{t("back-to-home")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
