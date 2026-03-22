import { ModuleCreateWithContent } from "@/components/modules/module-create-with-content";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/module-create-with-content")({
  component: RouteComponent,
  loader: () => ({ crumb: "create-module-with-content" }),
});

function RouteComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const onFinish = useCallback(() => {
    if (canGoBack) return router.history.back();
    navigate({ to: "/module" });
  }, [canGoBack, navigate, router.history]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("create-module-with-content")}</h1>
        <p className="text-muted-foreground">
          {t("create-module-with-content-description")}
        </p>
      </div>

      <ModuleCreateWithContent onCancel={onFinish} onSuccess={onFinish} />
    </div>
  );
}
