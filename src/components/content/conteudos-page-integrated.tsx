import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Video, FileText, HelpCircle, ExternalLink } from "lucide-react";
import { useContents } from "@/hooks/contents/use-contents";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import type { Content } from "@/api/stubs/contents-stub";

const contentTypes = [
  { id: "all", label: "Todos", icon: BookOpen },
  { id: "youtube_video", label: "Vídeos", icon: Video },
  { id: "article", label: "Leituras", icon: FileText },
  { id: "quiz", label: "Quizzes", icon: HelpCircle },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "youtube_video":
      return Video;
    case "article":
      return FileText;
    case "quiz":
      return HelpCircle;
    default:
      return BookOpen;
  }
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h${remainMins > 0 ? ` ${remainMins}min` : ""}`;
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "youtube_video":
      return "Vídeo";
    case "article":
      return "Artigo";
    case "quiz":
      return "Quiz";
    case "assignment":
      return "Exercício";
    case "lab":
      return "Lab";
    default:
      return type;
  }
};

function ContentCard({ content }: { content: Content }) {
  const TypeIcon = getTypeIcon(content.type);
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-16 h-10 rounded object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <TypeIcon size={20} className="text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{content.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {getTypeLabel(content.type)}
            </Badge>
            {content.duration_in_seconds > 0 && (
              <span>{formatDuration(content.duration_in_seconds)}</span>
            )}
            {content.author && (
              <>
                <span>•</span>
                <span className="truncate">{content.author}</span>
              </>
            )}
            {content.level && (
              <>
                <span>•</span>
                <span className="capitalize">{content.level}</span>
              </>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <a href={content.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Conteudos() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data: contents, isLoading, error, refetch } = useContents(activeTab);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          {t("pages.contents.title", "Conteúdos")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {t("pages.contents.description", "Explore todos os materiais de estudo disponíveis")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1.5">
              <type.icon size={14} />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 space-y-3">
          {isLoading && <LoadingState />}
          {error && <ErrorState error={error} onRetry={refetch} />}
          {!isLoading && !error && (!contents || contents.length === 0) && (
            <EmptyState
              title={t("pages.contents.no-content", "Nenhum conteúdo encontrado")}
              description={t("pages.contents.no-content-description", "Tente outro filtro")}
              icon={BookOpen}
            />
          )}
          {contents && contents.length > 0 && (
            <>
              {contents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
