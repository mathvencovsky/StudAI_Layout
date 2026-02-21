import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Brain, BookOpen } from "lucide-react";
import { useTrack } from "@/hooks/use-track";
import { useMyPlan } from "@/hooks/user-plan/use-my-plan";
import { useUpdatePlan } from "@/hooks/user-plan/use-update-plan";
import { useCreatePlan } from "@/hooks/user-plan/use-create-plan";
import { toast } from "sonner";

interface TrackDetailPageProps {
  trackId: string;
}

export function TrackDetailPage({ trackId }: TrackDetailPageProps) {
  const { data: track, isLoading: trackLoading } = useTrack(trackId);
  const { data: plan } = useMyPlan();
  const updatePlan = useUpdatePlan();
  const createPlan = useCreatePlan();
  const [adding, setAdding] = useState(false);

  const tracks = plan?.tracks ? JSON.parse(plan.tracks as any) : [];
  const isInPlan = tracks.some((t: any) => t.trackId === trackId);

  const handleAddToPlan = async () => {
    if (adding || !track) return;

    setAdding(true);
    try {
      if (!plan) {
        await createPlan.mutateAsync({
          activeProgramId: trackId,
          startDate: Date.now(),
          targetDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
          modulesProgress: JSON.stringify([]),
          completedHours: 0,
          tracks: JSON.stringify([{ trackId, addedAt: new Date().toISOString() }]),
        });
      } else {
        const updatedTracks = [...tracks, { trackId, addedAt: new Date().toISOString() }];
        
        await updatePlan.mutateAsync({
          id: plan.id,
          tracks: JSON.stringify(updatedTracks),
        });
      }

      toast.success("Trilha adicionada ao seu plano!");
    } catch (error) {
      toast.error("Erro ao adicionar trilha");
    } finally {
      setAdding(false);
    }
  };

  if (trackLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Trilha não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{track.title}</CardTitle>
            <CardDescription className="text-base">{track.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Link to="/study" className="flex-1">
              <Button className="w-full" size="lg">
                <Brain className="mr-2 h-5 w-5" />
                Estudar com IA
              </Button>
            </Link>
            {!isInPlan && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToPlan}
                disabled={adding}
                className="flex-1"
              >
                <Target className="mr-2 h-5 w-5" />
                Adicionar ao Meu Plano
              </Button>
            )}
            {isInPlan && (
              <Link to="/my-track" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Ver Meu Plano
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre esta Trilha</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta trilha foi criada para ajudá-lo a dominar os conceitos e habilidades necessárias.
            Adicione ao seu plano e comece a estudar com IA para obter recomendações personalizadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
