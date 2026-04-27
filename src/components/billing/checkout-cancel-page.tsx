import { useTranslation } from "react-i18next";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function CheckoutCancelPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{t("billing-cancel-title")}</h1>
          <p className="text-muted-foreground">{t("billing-cancel-desc")}</p>
        </div>

        <div className="rounded-xl border bg-card p-6 text-left space-y-3">
          <p className="text-sm font-medium">{t("billing-cancel-changed-mind")}</p>
          <p className="text-sm text-muted-foreground">{t("billing-cancel-changed-mind-body")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" onClick={() => void navigate({ to: "/plans" })}>
            <ArrowLeft className="w-4 h-4" />
            {t("billing-cancel-back-to-plans")}
          </Button>
          <Button className="flex-1" onClick={() => void navigate({ to: "/" })}>
            {t("billing-cancel-go-dashboard")}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => void navigate({ to: "/support" })}
        >
          <HelpCircle className="w-4 h-4" />
          {t("billing-cancel-contact-support")}
        </Button>
      </div>
    </div>
  );
}
