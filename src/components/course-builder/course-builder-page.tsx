import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useGenerateAndSaveCourse } from "@/hooks/ai/use-course-generator";
import { useGetFeatureUsageSummary } from "@/hooks/ai/use-plan-guard";
import { Loader2, Sparkles, AlertCircle, TrendingUp } from "lucide-react";
import { CoursePreview } from "./course-preview";
import type { CourseGenerationInput, GeneratedCourse } from "@/lib/ai/course-generator";

export function CourseBuilderPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseGenerationInput>({
    objetivo: "",
    nivel: "beginner",
    tempoDisponivel: 30,
    prazo: "",
    area: "",
    idioma: "pt",
  });

  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);

  const generateMutation = useGenerateAndSaveCourse();
  const { data: usageSummary } = useGetFeatureUsageSummary("course_builder");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await generateMutation.mutateAsync(formData);
      setGeneratedCourse(result.course);
    } catch (error: any) {
      // Error handling is done by the mutation
      console.error("Error generating course:", error);
    }
  };

  const handleSaveAndView = () => {
    if (generatedCourse && generateMutation.data?.savedCourse) {
      navigate({
        to: "/curso/$courseId",
        params: { courseId: generateMutation.data.savedCourse.id },
      });
    }
  };

  const handleReset = () => {
    setGeneratedCourse(null);
    generateMutation.reset();
  };

  // Check if limit reached
  const isLimitReached = usageSummary && usageSummary.remaining === 0;
  const isPlanError = generateMutation.error && (generateMutation.error as any).code === "PLAN_LIMIT_REACHED";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          Criar Curso com IA
        </h1>
        <p className="text-gray-600">
          Gere um curso personalizado com IA baseado nos seus objetivos e tempo disponível
        </p>
      </div>

      {/* Usage Summary */}
      {usageSummary && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Plano: {usageSummary.plan === "free" ? "Free" : "Pro"}
              </p>
              <p className="text-xs text-blue-700">
                {usageSummary.remaining} de {usageSummary.limit} cursos restantes hoje
              </p>
            </div>
            {usageSummary.plan === "free" && (
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade para Pro
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Plan Limit Error */}
      {isPlanError && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-300">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <div className="ml-2">
            <p className="font-medium text-yellow-900">Limite atingido</p>
            <p className="text-sm text-yellow-700">
              Você atingiu o limite de cursos para hoje. Faça upgrade para Pro para criar mais cursos!
            </p>
            <Button className="mt-2" size="sm">
              Fazer Upgrade
            </Button>
          </div>
        </Alert>
      )}

      {!generatedCourse ? (
        /* Form */
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Objetivo */}
            <div>
              <Label htmlFor="objetivo">
                O que você quer aprender? *
              </Label>
              <Input
                id="objetivo"
                placeholder="Ex: Python para análise de dados"
                value={formData.objetivo}
                onChange={(e) =>
                  setFormData({ ...formData, objetivo: e.target.value })
                }
                required
                disabled={generateMutation.isPending || isLimitReached}
              />
            </div>

            {/* Área */}
            <div>
              <Label htmlFor="area">Área de interesse *</Label>
              <Input
                id="area"
                placeholder="Ex: dados, web, cloud, IA"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
                disabled={generateMutation.isPending || isLimitReached}
              />
            </div>

            {/* Nível */}
            <div>
              <Label htmlFor="nivel">Seu nível atual *</Label>
              <select
                id="nivel"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.nivel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nivel: e.target.value as "beginner" | "intermediate" | "advanced",
                  })
                }
                disabled={generateMutation.isPending || isLimitReached}
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            {/* Tempo Disponível */}
            <div>
              <Label htmlFor="tempo">Tempo disponível por dia (minutos) *</Label>
              <Input
                id="tempo"
                type="number"
                min="15"
                max="480"
                value={formData.tempoDisponivel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tempoDisponivel: parseInt(e.target.value),
                  })
                }
                required
                disabled={generateMutation.isPending || isLimitReached}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recomendamos pelo menos 30 minutos por dia
              </p>
            </div>

            {/* Prazo */}
            <div>
              <Label htmlFor="prazo">Prazo ou meta (opcional)</Label>
              <Input
                id="prazo"
                placeholder="Ex: 3 meses, até dezembro"
                value={formData.prazo}
                onChange={(e) =>
                  setFormData({ ...formData, prazo: e.target.value })
                }
                disabled={generateMutation.isPending || isLimitReached}
              />
            </div>

            {/* Idioma */}
            <div>
              <Label htmlFor="idioma">Idioma preferido *</Label>
              <select
                id="idioma"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.idioma}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idioma: e.target.value as "pt" | "en",
                  })
                }
                disabled={generateMutation.isPending || isLimitReached}
              >
                <option value="pt">🇧🇷 Português</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>

            {/* Error Message */}
            {generateMutation.isError && !isPlanError && (
              <Alert className="bg-red-50 border-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="ml-2 text-sm text-red-700">
                  Erro ao gerar curso. Tente novamente.
                </p>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={generateMutation.isPending || isLimitReached}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando curso...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Curso com IA
                </>
              )}
            </Button>
          </form>
        </Card>
      ) : (
        /* Preview */
        <div className="space-y-6">
          <CoursePreview course={generatedCourse} />

          <div className="flex gap-4">
            <Button onClick={handleSaveAndView} className="flex-1">
              Ver Curso Completo
            </Button>
            <Button onClick={handleReset} variant="outline">
              Criar Outro Curso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
