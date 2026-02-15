import { ModuleEdit } from "@/components/modules/module-edit";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/module-edit/$moduleId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { moduleId } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const onFinish = useCallback(() => {
    if (canGoBack) return router.history.back();
    navigate({ to: "/module" });
  }, [canGoBack, navigate, router.history]);

  if (!moduleId) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{t("module-id-required")}</p>
        <button
          onClick={() => navigate({ to: "/module" })}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {t("go-back-to-modules")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ModuleEdit
        moduleId={moduleId}
        onCancel={onFinish}
        onSuccess={onFinish}
      />
    </div>
  );
}
