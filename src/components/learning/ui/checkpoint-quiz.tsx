import { useState } from "react";
import { CheckCircle, XCircle, Lightbulb, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Checkpoint } from "@/types/learning";

interface CheckpointQuizProps {
  checkpoint: Checkpoint;
  onComplete: (isCorrect: boolean) => void;
  className?: string;
}

export function CheckpointQuiz({
  checkpoint,
  onComplete,
  className
}: CheckpointQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === checkpoint.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onComplete(correct);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (checkpoint.isCompleted) {
    return (
      <Card className={cn("border-green-200 bg-green-50 dark:bg-green-950/20", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Checkpoint Concluído
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Você já completou este checkpoint. +{checkpoint.xpReward} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="h-5 w-5" />
          <span>Checkpoint de Compreensão</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showResult ? (
          <>
            {/* Question */}
            <div>
              <p className="font-medium text-foreground mb-4">
                {checkpoint.question}
              </p>
              
              {/* Options */}
              <div className="space-y-2">
                {checkpoint.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border-2 transition-all",
                      "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30",
                      selectedAnswer === option.id
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-950/50"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 transition-colors",
                        selectedAnswer === option.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-muted-foreground"
                      )}>
                        {selectedAnswer === option.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full"
            >
              Verificar Resposta
            </Button>
          </>
        ) : (
          <>
            {/* Result */}
            <div className={cn(
              "p-4 rounded-lg border-2",
              isCorrect
                ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                : "border-red-200 bg-red-50 dark:bg-red-950/20"
            )}>
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <p className={cn(
                    "font-medium mb-2",
                    isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                  )}>
                    {isCorrect ? "Correto!" : "Não foi dessa vez"}
                  </p>
                  
                  <p className={cn(
                    "text-sm",
                    isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  )}>
                    {checkpoint.explanation}
                  </p>

                  {isCorrect && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        +{checkpoint.xpReward} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              variant={isCorrect ? "default" : "outline"}
              className="w-full"
            >
              {isCorrect ? "Continuar ✨" : "Tentar Novamente"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}