import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { QuizData, QuizQuestion, QuizOption, QuestionType } from '@/types/quiz';

interface QuizEditorProps {
  data: QuizData;
  onChange: (data: QuizData) => void;
}

export function QuizEditor({ data, onChange }: QuizEditorProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      type: 'multiple-choice',
      question: '',
      points: 1,
      options: [
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
      ],
      order: data.questions.length,
    };

    onChange({
      ...data,
      questions: [...data.questions, newQuestion],
    });
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    onChange({
      ...data,
      questions: data.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    onChange({
      ...data,
      questions: data.questions.filter((q) => q.id !== questionId),
    });
  };

  const addOption = (questionId: string) => {
    const question = data.questions.find((q) => q.id === questionId);
    if (!question) return;

    const newOption: QuizOption = {
      id: generateId(),
      text: '',
      isCorrect: false,
    };

    updateQuestion(questionId, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionId: string, optionId: string, updates: Partial<QuizOption>) => {
    const question = data.questions.find((q) => q.id === questionId);
    if (!question) return;

    updateQuestion(questionId, {
      options: question.options.map((o) =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    });
  };

  const deleteOption = (questionId: string, optionId: string) => {
    const question = data.questions.find((q) => q.id === questionId);
    if (!question) return;

    updateQuestion(questionId, {
      options: question.options.filter((o) => o.id !== optionId),
    });
  };

  const setCorrectOption = (questionId: string, optionId: string) => {
    const question = data.questions.find((q) => q.id === questionId);
    if (!question) return;

    updateQuestion(questionId, {
      options: question.options.map((o) => ({
        ...o,
        isCorrect: o.id === optionId,
      })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Quiz</CardTitle>
          <CardDescription>Defina as regras e comportamento do quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passingScore">Nota Mínima (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={data.passingScore}
                onChange={(e) => onChange({ ...data, passingScore: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="timeLimit">Tempo Limite (minutos)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="0"
                value={data.timeLimit || ''}
                onChange={(e) => onChange({ ...data, timeLimit: parseInt(e.target.value) || undefined })}
                placeholder="Sem limite"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowRetry">Permitir Refazer</Label>
              <Switch
                id="allowRetry"
                checked={data.allowRetry}
                onCheckedChange={(checked) => onChange({ ...data, allowRetry: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showFeedback">Mostrar Feedback Imediato</Label>
              <Switch
                id="showFeedback"
                checked={data.showFeedbackImmediately}
                onCheckedChange={(checked) => onChange({ ...data, showFeedbackImmediately: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffleQuestions">Embaralhar Questões</Label>
              <Switch
                id="shuffleQuestions"
                checked={data.shuffleQuestions}
                onCheckedChange={(checked) => onChange({ ...data, shuffleQuestions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffleOptions">Embaralhar Opções</Label>
              <Switch
                id="shuffleOptions"
                checked={data.shuffleOptions}
                onCheckedChange={(checked) => onChange({ ...data, shuffleOptions: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questões */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questões</CardTitle>
              <CardDescription>
                {data.questions.length} {data.questions.length === 1 ? 'questão' : 'questões'}
              </CardDescription>
            </div>
            <Button onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Questão
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma questão adicionada ainda</p>
              <Button onClick={addQuestion} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Questão
              </Button>
            </div>
          ) : (
            data.questions.map((question, index) => (
              <Card key={question.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Questão {index + 1}</Badge>
                        <Badge variant="secondary">{question.points} {question.points === 1 ? 'ponto' : 'pontos'}</Badge>
                      </div>
                      
                      <div className="font-medium">
                        {question.question || <span className="text-muted-foreground">Nova questão</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                      >
                        {expandedQuestion === question.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedQuestion === question.id && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Pergunta</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Digite a pergunta..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Tipo de Questão</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: QuestionType) => updateQuestion(question.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Múltipla Escolha</SelectItem>
                            <SelectItem value="true-false">Verdadeiro/Falso</SelectItem>
                            <SelectItem value="short-answer">Resposta Curta</SelectItem>
                            <SelectItem value="essay">Dissertativa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Pontos</Label>
                        <Input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Opções (apenas para múltipla escolha e verdadeiro/falso) */}
                    {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Opções de Resposta</Label>
                          {question.type === 'multiple-choice' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar Opção
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCorrectOption(question.id, option.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  option.isCorrect
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-muted-foreground hover:border-green-500'
                                }`}
                              >
                                {option.isCorrect && <Check className="h-4 w-4 text-white" />}
                              </button>

                              <Input
                                value={option.text}
                                onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                placeholder={`Opção ${optionIndex + 1}`}
                                className="flex-1"
                              />

                              {question.type === 'multiple-choice' && question.options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteOption(question.id, option.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resposta Correta (para resposta curta) */}
                    {question.type === 'short-answer' && (
                      <div>
                        <Label>Resposta Correta</Label>
                        <Input
                          value={question.correctAnswer || ''}
                          onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                          placeholder="Digite a resposta correta..."
                        />
                      </div>
                    )}

                    {/* Explicação */}
                    <div>
                      <Label>Explicação (opcional)</Label>
                      <Textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                        placeholder="Explique a resposta correta..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
