import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame, Clock, BookCheck, CalendarDays, Mail, Edit, Check, X,
  Sparkles, Target, Brain,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useListLoginDays } from "@/hooks/user/use-login-days";
import { useListStudySessions } from "@/hooks/study-session/use-list-sessions";
import { useUserStats } from "@/hooks/user/use-user-stats";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { calculateStreak } from "@/utils/calculate-streak";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";
import { Skeleton } from "@/components/ui/skeleton";

const formatStudyTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const CATEGORY_LABELS: Record<string, string> = {
  web_development: "Web Dev",
  mobile_development: "Mobile",
  data_science: "Data Science",
  machine_learning: "Machine Learning",
  cloud_computing: "Cloud",
  devops: "DevOps",
  cybersecurity: "Segurança",
  databases: "Bancos de Dados",
  ui_ux_design: "UI/UX",
  game_development: "Games",
  blockchain: "Blockchain",
  embedded_systems: "Embarcados",
  vestibular_enem: "Vestibular/ENEM",
  concursos_publicos: "Concursos",
  certifications: "Certificações",
  languages: "Idiomas",
  math_logic: "Matemática",
  productivity_tools: "Produtividade",
  career_market: "Carreira",
  business_entrepreneurship: "Negócios",
  marketing_sales: "Marketing",
  design_creative: "Design",
  law: "Direito",
};

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const { data: loginDays = [], isLoading: loadingDays } = useListLoginDays();
  const { data: sessions = [], isLoading: loadingSessions } = useListStudySessions();
  const { data: stats, isLoading: loadingStats } = useUserStats();
  const { data: preference } = useMyLearningPreference();

  const { current: streak, longest } = useMemo(() => calculateStreak(loginDays), [loginDays]);

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0),
    [sessions]
  );

  const weeklyMinutes = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessions
      .filter((s) => s.startedAt != null && s.startedAt * 1000 >= weekAgo)
      .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  }, [sessions]);

  const dailyGoalMinutes = preference?.minutesPerDay ?? 30;
  const weeklyGoalMinutes = dailyGoalMinutes * 7;
  const weeklyProgress = Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100));

  const displayName = user?.displayName ?? "";
  const email = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const isLoading = loadingDays || loadingSessions || loadingStats;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("pages-profile-title")}</h1>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => { setEditedName(displayName); setIsEditing(true); }}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            {t("edit")}
          </Button>
        )}
      </div>

      {/* Identity card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="w-20 h-20 border-4 border-background shadow-lg flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">{t("pages-profile-name", "Nome")}</Label>
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-9 max-w-sm"
                      placeholder={displayName}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O nome é gerenciado pela sua conta. Alterações refletem no próximo login.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {t("save-changes")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-3.5 w-3.5 mr-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-xl font-bold truncate">
                    {displayName || t("pages-profile-unnamed")}
                  </h2>
                  {email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-sm truncate">{email}</span>
                    </div>
                  )}
                  {preference?.interests && preference.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {preference.interests.slice(0, 4).map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </Badge>
                      ))}
                      {preference.interests.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{preference.interests.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Flame,
            color: "text-orange-500 bg-orange-500/10",
            value: isLoading ? null : streak,
            label: t("pages-profile-current-streak"),
            sub: longest > 0 ? `Recorde: ${longest} dias` : undefined,
          },
          {
            icon: Clock,
            color: "text-blue-500 bg-blue-500/10",
            value: isLoading ? null : formatStudyTime(stats?.totalSecondsStudied ?? totalMinutes * 60),
            label: t("pages-profile-total-hours"),
          },
          {
            icon: BookCheck,
            color: "text-green-500 bg-green-500/10",
            value: isLoading ? null : (stats?.totalModulesCompleted ?? 0),
            label: t("modules-completed"),
          },
          {
            icon: CalendarDays,
            color: "text-purple-500 bg-purple-500/10",
            value: isLoading ? null : (stats?.totalDaysLoggedIn ?? loginDays.length),
            label: t("days-logged-in"),
          },
        ].map(({ icon: Icon, color, value, label, sub }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              {value === null ? (
                <Skeleton className="h-7 w-16 mb-1" />
              ) : (
                <p className="text-2xl font-bold leading-none">{value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
              {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly goal progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Meta semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {weeklyMinutes} min estudados esta semana
            </span>
            <span className="font-semibold">{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Meta: {weeklyGoalMinutes} min/semana ({dailyGoalMinutes} min/dia)
          </p>
        </CardContent>
      </Card>

      {/* Two column: learning preferences + upgrade */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Learning preferences summary */}
          {preference && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Preferências de aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preference.interests && preference.interests.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Áreas de interesse</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preference.interests.map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {preference.minutesPerDay && (
                    <div>
                      <p className="text-xs text-muted-foreground">Tempo diário</p>
                      <p className="font-medium">{preference.minutesPerDay} min/dia</p>
                    </div>
                  )}
                  {preference.contentLength && (
                    <div>
                      <p className="text-xs text-muted-foreground">Duração preferida</p>
                      <p className="font-medium capitalize">{preference.contentLength.replace("_", " ")}</p>
                    </div>
                  )}
                  {preference.days && preference.days.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Dias de estudo</p>
                      <p className="font-medium">{preference.days.length} dias/semana</p>
                    </div>
                  )}
                  {preference.formats && preference.formats.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Formatos</p>
                      <p className="font-medium">{preference.formats.join(", ")}</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/learning-preferences">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Editar preferências
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent activity */}
          {sessions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Sessões recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessions.slice(0, 5).map((session, i) => (
                  <div key={session.id ?? i} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80 capitalize">
                        {session.type?.replace("_", " ") ?? "Sessão"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {session.durationMinutes && (
                        <span>{session.durationMinutes} min</span>
                      )}
                      {session.startedAt && (
                        <span>
                          {new Date(session.startedAt * 1000).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}
