import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, HelpCircle, ExternalLink } from "lucide-react";
import { useListContent } from "@/hooks/content/use-list-content";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";
import { type Content } from "@/model/content";

const contentTypes = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "youtube_video", label: "Videos", icon: Video },
  { id: "article", label: "Articles", icon: FileText },
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
      return "Video";
    case "article":
      return "Article";
    case "quiz":
      return "Quiz";
    case "assignment":
      return "Assignment";
    case "lab":
      return "Lab";
    default:
      return type;
  }
};

function ContentCard({ content }: { content: Content }) {
  const TypeIcon = getTypeIcon(content.type ?? "");
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {content.thumbnailUrl ? (
          <img
            src={content.thumbnailUrl}
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
              {getTypeLabel(content.type ?? "")}
            </Badge>
            {content.durationInSeconds > 0 && (
              <span>{formatDuration(content.durationInSeconds)}</span>
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

export default function ContentsPageIntegrated() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data: allContents, isLoading, error, refetch } = useListContent();

  const contents = activeTab === "all"
    ? allContents
    : allContents?.filter((c) => c.type === activeTab);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          {t("pages-contents-title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {t("pages-contents-description")}
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
              title={t("pages-contents-no-content")}
              description={t("pages-contents-no-content-description")}
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
