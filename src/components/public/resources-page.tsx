import { useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Recursos</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Catálogo de Recursos
              </h1>
              <p className="text-lg text-gray-600">
                Recursos verificados e curados para acelerar seu aprendizado
              </p>
            </div>

            {/* Busca */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar recursos..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-white/60 border-gray-200 text-gray-900"
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="flex gap-3 mb-12 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#4A9FFF] hover:bg-[#3A8FEF] text-white rounded-full" : "rounded-full"}
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
                    className={selectedCategory === cat.id ? "bg-[#4A9FFF] hover:bg-[#3A8FEF] text-white rounded-full" : "rounded-full"}
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
                <p className="text-gray-600">Carregando recursos...</p>
              </div>
            ) : filteredResources && filteredResources.length > 0 ? (
              <div className="grid gap-6">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(resource.type || "article")}
                          <h3 className="text-xl font-normal text-gray-900">{resource.title}</h3>
                        </div>
                        <p className="text-gray-600">{resource.description}</p>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A9FFF] hover:text-[#3A8FEF] transition-colors ml-4 flex-shrink-0"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags?.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                          {tag}
                        </span>
                      ))}
                      {resource.level && (
                        <span className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 text-sm">
                          {resource.level}
                        </span>
                      )}
                      {resource.language && (
                        <span className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 text-sm">
                          {resource.language}
                        </span>
                      )}
                      {resource.verified && (
                        <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                          Verificado
                        </span>
                      )}
                    </div>
                    {resource.provider && (
                      <p className="text-sm text-gray-500 mt-4">
                        Provedor: {resource.provider}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Nenhum recurso encontrado. Tente outra busca.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
