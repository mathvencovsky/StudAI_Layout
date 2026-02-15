import { ContentCreate } from "@/components/content/content-create";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/content-create")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const onFinish = useCallback(() => {
    if (canGoBack) return router.history.back();
    navigate({ to: "/" });
  }, [canGoBack, navigate, router.history]);

  return <ContentCreate onCancel={onFinish} onSuccess={onFinish} />;
}
