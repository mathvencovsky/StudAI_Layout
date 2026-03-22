import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useSearchResourcesByKeyword,
  useGetTeoMeWhyResources,
  useGetResourcesForTopic,
} from "@/hooks/resource-catalog/use-search-resources";
import { ExternalLink, Search, Loader2 } from "lucide-react";

/**
 * Demo component to test resource search functionality
 * This can be used as reference for implementing resource search in other pages
 */
export function ResourceSearchDemo() {
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Search by keyword
  const { data: searchResults, isLoading: isSearching } =
    useSearchResourcesByKeyword(searchTerm, "pt");

  // Get TeoMeWhy resources
  const { data: teoResources, isLoading: isLoadingTeo } =
    useGetTeoMeWhyResources();

  // Get resources for a specific topic
  const { data: pythonResources, isLoading: isLoadingPython } =
    useGetResourcesForTopic("python", "beginner", "pt", 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(keyword);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Busca de Recursos</h1>
        <p className="text-gray-600">
          Demonstração do sistema de busca no catálogo de recursos verificados
        </p>
      </div>

      {/* Search Form */}
      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar recursos (ex: python, dados, react)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">Buscar</span>
          </Button>
        </form>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Resultados para "{searchTerm}"
          </h2>
          {isSearching ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              Nenhum recurso encontrado para "{searchTerm}"
            </Card>
          )}
        </div>
      )}

      {/* TeoMeWhy Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Recursos do TeoMeWhy 🎯
        </h2>
        <p className="text-gray-600 mb-4">
          Fonte prioritária para conteúdo em português sobre Python, dados e
          carreira
        </p>
        {isLoadingTeo ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : teoResources && teoResources.length > 0 ? (
          <div className="grid gap-4">
            {teoResources.slice(0, 5).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Nenhum recurso do TeoMeWhy encontrado
          </Card>
        )}
      </div>

      {/* Python for Beginners */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Python para Iniciantes
        </h2>
        <p className="text-gray-600 mb-4">
          Recursos recomendados para quem está começando com Python
        </p>
        {isLoadingPython ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : pythonResources && pythonResources.length > 0 ? (
          <div className="grid gap-4">
            {pythonResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Nenhum recurso de Python encontrado
          </Card>
        )}
      </div>
    </div>
  );
}

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    url: string;
    description?: string | null;
    type?: string | null;
    provider?: string | null;
    level?: string | null;
    language?: string | null;
    tags?: (string | null)[] | null;
    verified?: boolean | null;
  };
}

function ResourceCard({ resource }: ResourceCardProps) {
  const typeColors: Record<string, string> = {
    video: "bg-red-100 text-red-800",
    article: "bg-blue-100 text-blue-800",
    docs: "bg-green-100 text-green-800",
    course: "bg-purple-100 text-purple-800",
    playlist: "bg-orange-100 text-orange-800",
    repo: "bg-gray-100 text-gray-800",
  };

  const levelColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{resource.title}</h3>
            {resource.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                ✓ Verificado
              </Badge>
            )}
          </div>

          {resource.description && (
            <p className="text-gray-600 mb-3">{resource.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {resource.type && (
              <Badge className={typeColors[resource.type] || "bg-gray-100"}>
                {resource.type}
              </Badge>
            )}
            {resource.level && (
              <Badge className={levelColors[resource.level] || "bg-gray-100"}>
                {resource.level}
              </Badge>
            )}
            {resource.language && (
              <Badge variant="outline">
                {resource.language === "pt" ? "🇧🇷 PT-BR" : "🇺🇸 EN"}
              </Badge>
            )}
            {resource.provider && (
              <Badge variant="outline">{resource.provider}</Badge>
            )}
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.filter((tag): tag is string => tag !== null).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Acessar
          </Button>
        </a>
      </div>
    </Card>
  );
}
