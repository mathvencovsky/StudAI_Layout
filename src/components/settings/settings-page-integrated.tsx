import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, LogOut } from "lucide-react";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { BillingSettingsSection } from "@/components/billing/billing-settings-section";

export default function SettingsPageIntegrated() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mode, setMode, colorTheme, setColorTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading, error, refetch } = useMyProfile();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages-settings-title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages-settings-description")}
        </p>
      </div>

      {/* Appearance */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">
            {t("pages-settings-appearance")}
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">{t("pages-settings-dark-mode")}</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("pages-settings-theme-light")}</SelectItem>
                <SelectItem value="dark">{t("pages-settings-theme-dark")}</SelectItem>
                <SelectItem value="system">{t("pages-settings-theme-system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">{t("pages-settings-color-theme")}</Label>
            <Select value={colorTheme} onValueChange={setColorTheme}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("pages-settings-color-default")}</SelectItem>
                <SelectItem value="studai">{t("pages-settings-color-studai")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Study Preferences */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">
            {t("pages-settings-study")}
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <Label className="text-sm">{t("pages-settings-language")}</Label>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Account Info */}
      {(user?.email || profile?.createdAt) && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground">
              {t("pages-settings-account")}
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {user?.email && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  {t("pages-settings-email")}
                </span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            )}
            {profile?.createdAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  {t("pages-settings-member-since")}
                </span>
                <span className="text-sm font-medium">
                  {new Date(profile.createdAt).toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Billing */}
      <BillingSettingsSection />

      {/* Other Options */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <button
          onClick={() => void navigate({ to: "/privacy" })}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
        >
          <span className="text-sm text-foreground">
            {t("pages-settings-privacy")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="border-t" />
        <button
          onClick={() => void navigate({ to: "/support" })}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
        >
          <span className="text-sm text-foreground">
            {t("pages-settings-help")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="border-t" />
        <button
          onClick={() => void navigate({ to: "/faq" })}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
        >
          <span className="text-sm text-foreground">FAQ</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="border-t" />
        <button
          onClick={() => void navigate({ to: "/terms" })}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
        >
          <span className="text-sm text-foreground">
            {t("common-terms")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </section>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full text-muted-foreground h-9 text-sm"
        onClick={signOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t("pages-settings-logout")}
      </Button>
    </div>
  );
}
