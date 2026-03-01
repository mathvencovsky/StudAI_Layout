import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Flame, Clock, Edit, Check, X, Camera, Mail } from "lucide-react";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: profile, isLoading, error, refetch } = useMyProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const displayName = profile?.displayName ?? user?.displayName ?? "";
  const email = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = 0;
  const dailyGoalMinutes = profile?.dailyGoalMinutes ?? 30;
  const levelProgress = (xp % 1000) / 10;
  const xpForNext = 1000 - (xp % 1000);

  const handleEdit = () => {
    setEditedName(displayName);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t("pages.profile.title", "Perfil")}
        </h1>
        {!isEditing && (
          <Button variant="outline" size="sm" className="gap-1" onClick={handleEdit}>
            <Edit size={14} />
            {t("edit", "Editar")}
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("pages-profile-name")}</Label>
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder={t("pages-profile-name-placeholder")}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Check size={14} className="mr-1" />
                      {t("save", "Salvar")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X size={14} className="mr-1" />
                      {t("cancel", "Cancelar")}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold">{displayName || t("pages.profile.unnamed", "Usuário")}</h2>
                    {email && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      {t("pages.profile.level", "Nível")} {level}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {t("pages-profile-progress-to-level")} {level + 1}
                      </span>
                      <span className="text-muted-foreground">{levelProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={levelProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {t("pages-profile-xp-to-next-level", { xp: xpForNext })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.profile.total-xp", "XP Total")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.profile.current-streak", "Dias de Streak")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{dailyGoalMinutes}</p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.profile.daily-goal", "Meta Diária")} (min)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                {t("pages.profile.achievements", "Conquistas")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("pages.profile.no-achievements", "Nenhuma conquista ainda.")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}
