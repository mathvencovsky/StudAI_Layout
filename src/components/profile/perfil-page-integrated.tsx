import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trophy, Flame, Clock, Target, Edit, Check, X, Camera, Mail, Calendar, BookOpen } from "lucide-react";
import { useUserProfile, useUserBadges } from "@/hooks/profile/use-user-profile";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTranslation } from "react-i18next";
import { UpgradeCard } from "@/components/upgrade/upgrade-card";

export default function Perfil() {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { data: badges, isLoading: badgesLoading } = useUserBadges();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  if (profileLoading || badgesLoading) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <LoadingState />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
        <ErrorState error={profileError} onRetry={refetchProfile} />
      </div>
    );
  }

  if (!profile) return null;

  const unlockedBadges = badges?.filter((b) => b.unlocked) || [];
  const levelProgress = (profile.xp % 1000) / 10;
  const xpForNext = 1000 - (profile.xp % 1000);

  const handleEdit = () => {
    setEditedName(profile.name);
    setEditedEmail(profile.email);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica de salvar
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
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

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="seu@email.com"
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
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      {t("pages.profile.level", "Nível")} {profile.level}
                    </Badge>
                    <Badge variant="secondary">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {profile.currentProgram}
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {t("pages.profile.member-since", "Membro desde")} {profile.memberSince}
                    </Badge>
                  </div>

                  {/* Level Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {t("pages.profile.progress-to-level", "Progresso para Nível")} {profile.level + 1}
                      </span>
                      <span className="text-muted-foreground">{levelProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={levelProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {xpForNext} XP para o próximo nível
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{profile.xp.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{profile.streak}</p>
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
                <p className="text-2xl font-bold">{Math.floor(profile.totalStudyMinutes / 60)}h</p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.profile.study-time", "Tempo de Estudo")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">
                  {Math.round((profile.weeklyProgress / profile.weeklyGoal) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.profile.weekly-goal", "Meta Semanal")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Badges */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                {t("pages.profile.achievements", "Conquistas")} ({unlockedBadges.length}/{badges?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {badges?.map((badge) => (
                  <button
                    key={badge.id}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      badge.unlocked
                        ? "bg-card hover:shadow-md hover:border-primary/50 hover:scale-105"
                        : "bg-muted/30 opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{badge.icon}</span>
                    <p className="font-semibold text-sm truncate">{badge.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {badge.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info & Upgrade */}
        <div className="space-y-6">
          {/* Upgrade Card */}
          <UpgradeCard />

          {/* Study Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("pages.profile.study-info", "Informações de Estudo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  {t("pages.profile.current-program", "Programa Atual")}
                </span>
                <span className="text-sm font-medium">{profile.currentProgram}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  {t("pages.profile.current-focus", "Foco Atual")}
                </span>
                <span className="text-sm font-medium">{profile.currentFocus}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  {t("pages.profile.daily-goal", "Meta Diária")}
                </span>
                <span className="text-sm font-medium">{profile.dailyGoal} min/dia</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { Perfil as PerfilPageIntegrated };
