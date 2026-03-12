import { useState } from "react";
import { Code, Play, Lightbulb, CheckCircle, Trophy, Eye, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Exercise } from "@/types/learning";

interface PracticeExerciseProps {
  exercise: Exercise;
  onComplete: (solution: string) => void;
  onRequestHint?: () => void;
  className?: string;
}

export function PracticeExercise({
  exercise,
  onComplete,
  onRequestHint,
  className
}: PracticeExerciseProps) {
  const [userCode, setUserCode] = useState(exercise.starterCode || "");
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }>>([]);

  const handleRunCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      if (exercise.testCases) {
        const results = exercise.testCases.map(testCase => ({
          passed: Math.random() > 0.3, // Simulate test results
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: "resultado simulado" // This would be actual execution result
        }));
        setTestResults(results);
      }
      
      setOutput("Código executado com sucesso!");
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    onComplete(userCode);
  };

  if (exercise.isCompleted) {
    return (
      <Card className={cn("border-green-200 bg-green-50 dark:bg-green-950/20", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Exercício Concluído
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Parabéns! Você completou este exercício. +{exercise.xpReward} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
          <Code className="h-5 w-5" />
          <span>Hora de Praticar!</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Exercise Description */}
        <div>
          <h4 className="font-medium mb-2">{exercise.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {exercise.description}
          </p>
          
          {/* Instructions */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Instruções:</p>
            <p className="text-sm">{exercise.instructions}</p>
          </div>
        </div>

        {/* Code Editor and Results */}
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">Resultado</TabsTrigger>
            <TabsTrigger value="tests">Testes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-3">
            <Textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Digite seu código aqui..."
              className="font-mono text-sm min-h-[200px] resize-none"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? "Executando..." : "Executar Código"}</span>
              </Button>
              
              {onRequestHint && (
                <Button
                  onClick={onRequestHint}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Dica da IA</span>
                </Button>
              )}
              
              {exercise.solution && (
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ver Solução</span>
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="output">
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px]">
              {output || "Execute o código para ver o resultado..."}
            </div>
          </TabsContent>
          
          <TabsContent value="tests">
            <div className="space-y-2">
              {testResults.length > 0 ? (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border",
                      result.passed
                        ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                        : "border-red-200 bg-red-50 dark:bg-red-950/20"
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        Teste {index + 1}: {result.passed ? "Passou" : "Falhou"}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <p><strong>Entrada:</strong> {result.input}</p>
                      <p><strong>Esperado:</strong> {result.expected}</p>
                      <p><strong>Resultado:</strong> {result.actual}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Execute o código para ver os resultados dos testes...
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Solution Display */}
        {showSolution && exercise.solution && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Solução:</h5>
            <pre className="text-sm font-mono bg-background p-3 rounded border overflow-x-auto">
              {exercise.solution}
            </pre>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>+{exercise.xpReward} XP ao completar</span>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!userCode.trim()}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Enviar Solução</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}