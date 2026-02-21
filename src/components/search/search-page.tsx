import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Video, FileText, Heart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@/hooks/search/use-search";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "react-i18next";

export function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const { data: results, isLoading } = useSearch(searchQuery, {
    type: typeFilter,
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "track":
        return <Video className="h-4 w-4" />;
      case "content":
        return <BookOpen className="h-4 w-4" />;
      case "assessment":
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "track":
        return t("pages-search-type-track-label");
      case "content":
        return t("pages-search-type-content-label");
      case "assessment":
        return t("pages-search-type-assessment-label");
      default:
        return type;
    }
  };

  const typeFilters = [
    { value: undefined, label: t("pages-search-type-all") },
    { value: "track", label: t("pages-search-type-tracks") },
    { value: "content", label: t("pages-search-type-content") },
    { value: "assessment", label: t("pages-search-type-assessments") },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("pages-search-title")}</h1>
        <p className="text-muted-foreground">
          {t("pages-search-subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("pages-search-placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {typeFilters.map((filter) => (
              <Button
                key={filter.value || "all"}
                variant={typeFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {searchQuery.length < 3 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t("pages-search-min-chars")}
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <LoadingState />
        ) : !results || results.length === 0 ? (
          <EmptyState
            title={t("pages-search-no-results")}
            description={t("pages-search-try-different")}
            icon={Search}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("pages-search-results", { count: results.length })}
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(result.type)}
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {result.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {result.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (result.type === "track") {
                          navigate({ to: "/track/$trackId", params: { trackId: result.id } });
                        } else if (result.type === "content") {
                          navigate({ to: "/content/$contentId", params: { contentId: result.id } });
                        } else {
                          navigate({ to: "/assessments" });
                        }
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      {t("pages-search-view-details")}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
