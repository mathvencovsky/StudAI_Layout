import { useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, LogOut } from "lucide-react";
import { useUserPreferences } from "@/hooks/settings/use-user-preferences";
import { useUserAccount } from "@/hooks/settings/use-user-account";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";

export default function Configuracoes() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { data: preferences, isLoading: prefsLoading, error: prefsError, refetch: refetchPrefs } = useUserPreferences();
  const { data: account, isLoading: accountLoading } = useUserAccount();

  const [localNotifications, setLocalNotifications] = useState(preferences?.notifications.push || false);
  const [localReminder, setLocalReminder] = useState(preferences?.notifications.reviewReminders || false);

  const isDarkMode = theme === "dark";

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (prefsLoading || accountLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <LoadingState />
      </div>
    );
  }

  if (prefsError) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <ErrorState error={prefsError} onRetry={refetchPrefs} />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          {t("pages.settings.title", "Configurações")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("pages.settings.description", "Preferências.")}
        </p>
      </div>

      {/* Notifications */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">
            {t("pages.settings.notifications", "Notificações")}
          </h2>
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between p-4">
            <div>
              <Label htmlFor="notifications" className="text-sm">
                {t("pages.settings.push", "Push")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("pages.settings.push-description", "Alertas no dispositivo")}
              </p>
            </div>
            <Switch
              id="notifications"
              checked={localNotifications}
              onCheckedChange={setLocalNotifications}
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <Label htmlFor="reminder" className="text-sm">
                {t("pages.settings.daily-reminder", "Lembrete diário")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("pages.settings.daily-reminder-description", "Hora de estudar")}
              </p>
            </div>
            <Switch
              id="reminder"
              checked={localReminder}
              onCheckedChange={setLocalReminder}
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">
            {t("pages.settings.appearance", "Aparência")}
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode" className="text-sm">
                {t("pages.settings.dark-mode", "Modo escuro")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("pages.settings.dark-mode-description", "Tema claro/escuro")}
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </div>
      </section>

      {/* Study Preferences */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">
            {t("pages.settings.study", "Estudo")}
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">
              {t("pages.settings.daily-goal", "Meta diária")}
            </Label>
            <Select
              value={preferences?.defaultGoalMinutes.toString()}
              onValueChange={(value) => console.log("Update goal:", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">120 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">
              {t("pages.settings.language", "Idioma")}
            </Label>
            <Select
              value={i18n.language}
              onValueChange={handleLanguageChange}
            >
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
      {account && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground">
              {t("pages.settings.account", "Conta")}
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {t("pages.settings.email", "Email")}
              </span>
              <span className="text-sm font-medium">{account.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {t("pages.settings.member-since", "Membro desde")}
              </span>
              <span className="text-sm font-medium">
                {new Date(account.registeredAt).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Other Options */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
          <span className="text-sm text-foreground">
            {t("pages.settings.privacy", "Privacidade")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="border-t" />
        <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
          <span className="text-sm text-foreground">
            {t("pages.settings.help", "Ajuda")}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </section>

      {/* Logout */}
      <Button variant="outline" className="w-full text-muted-foreground h-9 text-sm">
        <LogOut className="w-4 h-4 mr-2" />
        {t("pages.settings.logout", "Sair")}
      </Button>

      <p className="text-center text-xs text-muted-foreground">v1.0.0</p>
    </div>
  );
}
