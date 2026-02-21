import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useTracks } from "@/hooks/use-tracks";
import type { Track } from "@/model/track";
import { useTranslation } from "react-i18next";

export function SearchTracksPage() {
  const { t } = useTranslation();
  const { data: tracks } = useTracks();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim() || !tracks) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = tracks.filter((track: Track) => {
      const matchesTitle = track.title.toLowerCase().includes(query);
      const matchesDescription = track.description?.toLowerCase().includes(query);
      return matchesTitle || matchesDescription;
    });

    results.sort((a: Track, b: Track) => {
      const aTitle = a.title.toLowerCase().includes(query) ? 2 : 0;
      const aDescription = a.description?.toLowerCase().includes(query) ? 1 : 0;
      const aScore = aTitle + aDescription;

      const bTitle = b.title.toLowerCase().includes(query) ? 2 : 0;
      const bDescription = b.description?.toLowerCase().includes(query) ? 1 : 0;
      const bScore = bTitle + bDescription;

      return bScore - aScore;
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pages-search-tracks-title")}</h1>
        <p className="text-muted-foreground">{t("pages-search-tracks-description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t("pages-search-tracks-smart-search")}
          </CardTitle>
          <CardDescription>
            {t("pages-search-tracks-smart-search-description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("pages-search-tracks-placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              {t("pages-search-tracks-search")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {t("pages.search-tracks.results", { count: searchResults.length })}
            </h2>
            {searchResults.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {t("pages.search-tracks.found", { count: searchResults.length })}
              </p>
            )}
          </div>

          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("pages-search-tracks-no-results")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("pages-search-tracks-try-different")}
                </p>
                <Link to="/explore">
                  <Button variant="outline">{t("pages-search-tracks-explore-all")}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((track) => (
                <Card key={track.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{track.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {track.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Link to="/explore/$trackId" params={{ trackId: track.id }} className="flex-1">
                        <Button variant="outline" className="w-full">{t("pages-search-tracks-view")}</Button>
                      </Link>
                      <Link to="/explore/$trackId" params={{ trackId: track.id }} className="flex-1">
                        <Button className="w-full">{t("pages-search-tracks-add")}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("pages-search-tracks-start-search")}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {t("pages-search-tracks-start-search-description")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
