import { useMemo, useState } from "react";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type AuthAdapter = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

function toastFallback(message: string) {
  if (typeof window !== "undefined") window.alert(message);
}

function getAdapter(): AuthAdapter | null {
  try {
    const anyWin = window as any;
    const adapter = anyWin.__STUDAI_AUTH_ADAPTER__ as AuthAdapter | undefined;
    return adapter ?? null;
  } catch {
    return null;
  }
}

export function AuthCard({ className }: { className?: string }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const minPasswordOk = useMemo(() => password.length >= 6, [password]);
  const passwordsMatch = useMemo(
    () => confirmPassword === password,
    [confirmPassword, password]
  );

  async function handleLogin() {
    if (!email || !password) {
      toastFallback(t("auth-toast-fill-fields"));
      return;
    }
    setBusy(true);
    try {
      const adapter = getAdapter();
      if (!adapter) {
        toastFallback(
          "Integração de autenticação pendente. Configure __STUDAI_AUTH_ADAPTER__."
        );
        return;
      }
      await adapter.signIn(email.trim(), password);
      toastFallback(t("auth-toast-welcome-back"));
    } catch {
      toastFallback(t("auth-toast-login-error"));
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      toastFallback(t("auth-toast-fill-all-fields"));
      return;
    }
    if (!minPasswordOk) {
      toastFallback(t("auth-toast-min-password"));
      return;
    }
    if (!passwordsMatch) {
      toastFallback(t("auth-toast-passwords-dont-match"));
      return;
    }
    setBusy(true);
    try {
      const adapter = getAdapter();
      if (!adapter) {
        toastFallback(
          "Integração de autenticação pendente. Configure __STUDAI_AUTH_ADAPTER__."
        );
        return;
      }
      await adapter.signUp(email.trim(), password);
      toastFallback(t("auth-toast-account-created"));
      setTab("login");
    } catch {
      toastFallback(t("auth-toast-register-error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className={cn("w-full max-w-md border-2 shadow-2xl", className)} id="auth-card">
      <CardContent className="p-5 sm:p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="font-bold">
              {t("auth-tab-login")}
            </TabsTrigger>
            <TabsTrigger value="register" className="font-bold">
              {t("auth-tab-register")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                {t("auth-login-title")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("auth-login-desc")}
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="font-semibold">
                  {t("auth-email")}
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("auth-email-placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="font-semibold">
                  {t("auth-password")}
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("auth-password-placeholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={
                      showPassword
                        ? t("auth-hide-password")
                        : t("auth-show-password")
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={busy}
              className="w-full font-bold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
            >
              {busy ? t("auth-logging-in") : t("auth-login-button")}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold">{t("auth-cant-access")}</span>
              <a
                href="mailto:support@studi.app"
                className="inline-flex items-center gap-1 font-bold hover:text-foreground"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                {t("auth-need-help")}
              </a>
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-5 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                {t("auth-register-title")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("auth-register-desc")}
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="font-semibold">
                  {t("auth-email")}
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("auth-email-placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="font-semibold">
                  {t("auth-password")}
                </Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder={t("auth-min-password-placeholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={
                      showPassword
                        ? t("auth-hide-password")
                        : t("auth-show-password")
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    minPasswordOk ? "text-success" : "text-muted-foreground"
                  )}
                >
                  {t("auth-min-chars")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="font-semibold">
                  {t("auth-confirm-password")}
                </Label>
                <Input
                  id="register-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("auth-min-password-placeholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && (
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      passwordsMatch ? "text-success" : "text-destructive"
                    )}
                  >
                    {passwordsMatch
                      ? t("auth-passwords-match")
                      : t("auth-toast-passwords-dont-match")}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={busy}
              className="w-full font-bold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
            >
              {busy ? t("auth-registering") : t("auth-register-button")}
            </Button>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("auth-agree-terms")}{" "}
              <a
                className="font-bold hover:text-foreground underline"
                href="/terms"
              >
                {t("common-terms")}
              </a>{" "}
              {t("auth-and-privacy")}{" "}
              <a
                className="font-bold hover:text-foreground underline"
                href="/privacy"
              >
                {t("common-privacy")}
              </a>
              .
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
