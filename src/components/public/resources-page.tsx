import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, BookOpen, Video, FileText, Code } from "lucide-react";
import { useSearchResourcesByKeyword } from "@/hooks/resource-catalog/use-search-resources";

export function ResourcesPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: resources, isLoading } = useSearchResourcesByKeyword(keyword || "python");

  // Filter by category on client side
  const filteredResources = selectedCategory
    ? resources?.filter((r) => r.category?.toLowerCase().includes(selectedCategory.toLowerCase()))
    : resources;

  const categories = [
    { id: "programming", label: "Programação", icon: Code },
    { id: "data-science", label: "Data Science", icon: BookOpen },
    { id: "web-dev", label: "Web Dev", icon: FileText },
    { id: "video", label: "Vídeos", icon: Video },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "documentation": return <BookOpen className="h-4 w-4" />;
      case "course": return <Code className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Catálogo de Recursos</h1>
            <p className="text-lg text-muted-foreground">
              Recursos verificados e curados para acelerar seu aprendizado
            </p>
          </div>

          {/* Busca */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar recursos..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex gap-2 mb-8 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Lista de Recursos */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando recursos...</p>
            </div>
          ) : filteredResources && filteredResources.length > 0 ? (
            <div className="grid gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {getTypeIcon(resource.type || "article")}
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {resource.description}
                        </CardDescription>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {resource.level && (
                        <Badge variant="outline">{resource.level}</Badge>
                      )}
                      {resource.language && (
                        <Badge variant="outline">{resource.language}</Badge>
                      )}
                      {resource.verified && (
                        <Badge className="bg-green-500">Verificado</Badge>
                      )}
                    </div>
                    {resource.provider && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Provedor: {resource.provider}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum recurso encontrado. Tente outra busca.
              </p>
            </div>
          )}
        </div>
      </div>    </div>
  );
}
