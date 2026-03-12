import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Flame } from "lucide-react";
import { useWeeklyRanking } from "@/hooks/ranking/use-weekly-ranking";
import { useMyProfile } from "@/hooks/user-profile/use-my-profile";

export function RankingPage() {
  const { data: ranking, isLoading } = useWeeklyRanking();
  const { data: profile } = useMyProfile();

  const myEntry = ranking?.find((entry) => entry.userId === profile?.owner);
  const topThree = ranking?.slice(0, 3) || [];
  const others = ranking?.slice(3) || [];

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ranking Semanal</h1>
        <p className="text-muted-foreground">Veja os estudantes mais dedicados da semana</p>
      </div>

      {myEntry && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Sua Posição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">
                  #{myEntry.position}
                </div>
                <div>
                  <p className="font-semibold">{myEntry.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {myEntry.xpWeek} XP esta semana
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-semibold">{myEntry.streak} dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((entry) => (
            <Card 
              key={entry.id} 
              className={`${entry.position === 1 ? "border-2 border-yellow-500" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.displayName}</CardTitle>
                  {getMedalIcon(entry.position || 0)}
                </div>
                <CardDescription>#{entry.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">XP desta semana</p>
                  <p className="text-2xl font-bold">{entry.xpWeek}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{entry.streak} dias de streak</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outros Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {others.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        #{entry.position}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{entry.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.xpWeek} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{entry.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!ranking || ranking.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ranking vazio</h3>
            <p className="text-muted-foreground">
              Seja o primeiro a aparecer no ranking desta semana!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
