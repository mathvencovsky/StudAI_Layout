import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { ContentBlock, QuizContent } from '@/types/admin-track';

interface QuizBlockEditorProps {
  block: ContentBlock;
}

export function QuizBlockEditor({ block }: QuizBlockEditorProps) {
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  
  const quizContent = block.content as QuizContent;

  const handleUpdate = (updates: Partial<QuizContent>) => {
    const newContent = { ...quizContent, ...updates };
    updateContentBlock(block.id, {
      content: newContent,
      isComplete: newContent.questions.length > 0 && 
                  newContent.questions.every(q => 
                    q.question.trim() && 
                    q.options.length >= 2 &&
                    q.options.some(o => o.isCorrect)
                  ),
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type: 'multiple_choice' as const,
      question: '',
      options: [
        { id: `o-${Date.now()}-1`, text: '', isCorrect: false },
        { id: `o-${Date.now()}-2`, text: '', isCorrect: false },
      ],
      explanation: '',
      points: 1,
      order: quizContent.questions.length,
    };
    
    handleUpdate({ questions: [...quizContent.questions, newQuestion] });
  };

  const updateQuestion = (questionId: string, updates: any) => {
    handleUpdate({
      questions: quizContent.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    handleUpdate({
      questions: quizContent.questions.filter(q => q.id !== questionId),
    });
  };

  const addOption = (questionId: string) => {
    const question = quizContent.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOption = {
      id: `o-${Date.now()}`,
      text: '',
      isCorrect: false,
    };

    updateQuestion(questionId, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionId: string, optionId: string, updates: any) => {
    const question = quizContent.questions.find(q => q.id === questionId);
    if (!question) return;

    updateQuestion(questionId, {
      options: question.options.map(o =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    });
  };

  const deleteOption = (questionId: string, optionId: string) => {
    const question = quizContent.questions.find(q => q.id === questionId);
    if (!question || question.options.length <= 2) return;

    updateQuestion(questionId, {
      options: question.options.filter(o => o.id !== optionId),
    });
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-title">Título do Quiz</Label>
          <Input
            id="quiz-title"
            value={quizContent.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            placeholder="Ex: Teste seus conhecimentos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-description">Descrição (opcional)</Label>
          <Textarea
            id="quiz-description"
            value={quizContent.description || ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Instruções para o quiz..."
            rows={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="passing-score">Nota de Aprovação (%)</Label>
            <Input
              id="passing-score"
              type="number"
              min="0"
              max="100"
              value={quizContent.passingScore}
              onChange={(e) => handleUpdate({ passingScore: parseInt(e.target.value) || 70 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-attempts">Máximo de Tentativas</Label>
            <Input
              id="max-attempts"
              type="number"
              min="0"
              value={quizContent.maxAttempts || 0}
              onChange={(e) => handleUpdate({ maxAttempts: parseInt(e.target.value) || 0 })}
              placeholder="0 = ilimitado"
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Questões ({quizContent.questions.length})</h4>
          <Button onClick={addQuestion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Questão
          </Button>
        </div>

        {quizContent.questions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              Nenhuma questão adicionada ainda
            </p>
            <Button onClick={addQuestion} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Questão
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {quizContent.questions.map((question, qIndex) => (
              <div key={question.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Questão {qIndex + 1}</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Digite a pergunta..."
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Alternativas</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={option.isCorrect}
                        onChange={() => {
                          // Marcar apenas esta como correta
                          updateQuestion(question.id, {
                            options: question.options.map(o => ({
                              ...o,
                              isCorrect: o.id === option.id,
                            })),
                          });
                        }}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm font-medium w-6">{String.fromCharCode(65 + oIndex)})</span>
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                        placeholder="Texto da alternativa"
                        className="flex-1"
                      />
                      {option.isCorrect && (
                        <Badge variant="default" className="flex-shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correta
                        </Badge>
                      )}
                      {question.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOption(question.id, option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {question.options.length < 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Adicionar Alternativa
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Explicação (mostrada após resposta)</Label>
                  <Textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                    placeholder="Explique por que esta é a resposta correta..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
