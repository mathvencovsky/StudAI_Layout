import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionnaireData {
  topic: string;
  goal: string;
  currentKnowledge: string;
  timeAvailable: string;
  learningStyle: string;
  deadline: string;
  specificTopics: string;
}

export function CriarTrilhaPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState<QuestionnaireData>({
    topic: "",
    goal: "",
    currentKnowledge: "beginner",
    timeAvailable: "",
    learningStyle: "",
    deadline: "",
    specificTopics: "",
  });

  const updateFormData = (field: keyof QuestionnaireData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.topic.trim().length > 0;
      case 2:
        return formData.goal.trim().length > 0;
      case 3:
        return formData.currentKnowledge.length > 0;
      case 4:
        return formData.timeAvailable.length > 0;
      case 5:
        return formData.learningStyle.length > 0;
      case 6:
        return true; // Última etapa é opcional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // TODO: Chamar API para gerar trilha com IA usando as preferências salvas + questionário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t("questionnaire-track-created"));
      navigate({ to: "/explorar" });
    } catch (error) {
      toast.error(t("questionnaire-track-error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-lg font-semibold">
                {t("questionnaire-topic-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {t("questionnaire-topic-helper")}
              </p>
              <Input
                id="topic"
                placeholder={t("questionnaire-topic-placeholder")}
                value={formData.topic}
                onChange={(e) => updateFormData("topic", e.target.value)}
                className="text-lg"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal" className="text-lg font-semibold">
                {t("questionnaire-goal-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {t("questionnaire-goal-helper")}
              </p>
              <Textarea
                id="goal"
                placeholder={t("questionnaire-goal-placeholder")}
                value={formData.goal}
                onChange={(e) => updateFormData("goal", e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">
                {t("questionnaire-knowledge-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {t("questionnaire-knowledge-helper")}
              </p>
              <RadioGroup
                value={formData.currentKnowledge}
                onValueChange={(value) => updateFormData("currentKnowledge", value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="beginner" id="beginner" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="beginner" className="font-semibold cursor-pointer">
                      {t("questionnaire-knowledge-beginner")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-knowledge-beginner-desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="intermediate" id="intermediate" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="intermediate" className="font-semibold cursor-pointer">
                      {t("questionnaire-knowledge-intermediate")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-knowledge-intermediate-desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="advanced" className="font-semibold cursor-pointer">
                      {t("questionnaire-knowledge-advanced")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-knowledge-advanced-desc")}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeAvailable" className="text-lg font-semibold">
                {t("questionnaire-time-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {t("questionnaire-time-helper")}
              </p>
              <Select
                value={formData.timeAvailable}
                onValueChange={(value) => updateFormData("timeAvailable", value)}
              >
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder={t("questionnaire-time-placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">{t("questionnaire-time-1-3")}</SelectItem>
                  <SelectItem value="4-7">{t("questionnaire-time-4-7")}</SelectItem>
                  <SelectItem value="8-14">{t("questionnaire-time-8-14")}</SelectItem>
                  <SelectItem value="15+">{t("questionnaire-time-15-plus")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">
                {t("questionnaire-style-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {t("questionnaire-style-helper")}
              </p>
              <RadioGroup
                value={formData.learningStyle}
                onValueChange={(value) => updateFormData("learningStyle", value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="video" id="video" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="video" className="font-semibold cursor-pointer">
                      {t("questionnaire-style-video")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-style-video-desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="reading" id="reading" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="reading" className="font-semibold cursor-pointer">
                      {t("questionnaire-style-reading")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-style-reading-desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="practice" id="practice" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="practice" className="font-semibold cursor-pointer">
                      {t("questionnaire-style-practice")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-style-practice-desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="mixed" id="mixed" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="mixed" className="font-semibold cursor-pointer">
                      {t("questionnaire-style-mixed")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("questionnaire-style-mixed-desc")}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="deadline" className="text-lg font-semibold">
                {t("questionnaire-deadline-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {t("questionnaire-deadline-helper")}
              </p>
              <Input
                id="deadline"
                placeholder={t("questionnaire-deadline-placeholder")}
                value={formData.deadline}
                onChange={(e) => updateFormData("deadline", e.target.value)}
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="specificTopics" className="text-lg font-semibold">
                {t("questionnaire-topics-title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {t("questionnaire-topics-helper")}
              </p>
              <Textarea
                id="specificTopics"
                placeholder={t("questionnaire-topics-placeholder")}
                value={formData.specificTopics}
                onChange={(e) => updateFormData("specificTopics", e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{t("create-track-with-ai")}</h1>
        </div>
        <p className="text-muted-foreground">
          {t("create-track-with-ai-description")}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {t("questionnaire-step-of", { step, total: totalSteps })}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("questionnaire-progress", { percent: Math.round((step / totalSteps) * 100) })}
          </span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 1 && t("questionnaire-topic-title")}
            {step === 2 && t("questionnaire-goal-title")}
            {step === 3 && t("questionnaire-knowledge-title")}
            {step === 4 && t("questionnaire-time-title")}
            {step === 5 && t("questionnaire-style-title")}
            {step === 6 && t("questionnaire-details-title")}
          </CardTitle>
          <CardDescription>
            {step === 1 && t("questionnaire-topic-helper")}
            {step === 2 && t("questionnaire-goal-helper")}
            {step === 3 && t("questionnaire-knowledge-helper")}
            {step === 4 && t("questionnaire-time-helper")}
            {step === 5 && t("questionnaire-style-helper")}
            {step === 6 && t("questionnaire-deadline-helper")}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isGenerating}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("previous")}
        </Button>

        {step < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className="gap-2"
          >
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("questionnaire-generating")}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {t("questionnaire-create-track")}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Summary Preview (última etapa) */}
      {step === totalSteps && (
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("questionnaire-summary-title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">{t("questionnaire-summary-topic")}</span> {formData.topic}
            </div>
            <div>
              <span className="font-semibold">{t("questionnaire-summary-goal")}</span> {formData.goal}
            </div>
            <div>
              <span className="font-semibold">{t("questionnaire-summary-level")}</span>{" "}
              {formData.currentKnowledge === "beginner" && t("questionnaire-knowledge-beginner")}
              {formData.currentKnowledge === "intermediate" && t("questionnaire-knowledge-intermediate")}
              {formData.currentKnowledge === "advanced" && t("questionnaire-knowledge-advanced")}
            </div>
            <div>
              <span className="font-semibold">{t("questionnaire-summary-time")}</span> {formData.timeAvailable}
            </div>
            <div>
              <span className="font-semibold">{t("questionnaire-summary-style")}</span>{" "}
              {formData.learningStyle === "video" && t("questionnaire-style-video")}
              {formData.learningStyle === "reading" && t("questionnaire-style-reading")}
              {formData.learningStyle === "practice" && t("questionnaire-style-practice")}
              {formData.learningStyle === "mixed" && t("questionnaire-style-mixed")}
            </div>
            {formData.deadline && (
              <div>
                <span className="font-semibold">{t("questionnaire-summary-deadline")}</span> {formData.deadline}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
