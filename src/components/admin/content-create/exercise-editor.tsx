import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ExerciseData, ExerciseStep, ExerciseResource, EvaluationCriterion } from '@/types/quiz';

interface ExerciseEditorProps {
  data: ExerciseData;
  onChange: (data: ExerciseData) => void;
}

export function ExerciseEditor({ data, onChange }: ExerciseEditorProps) {
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addStep = () => {
    const newStep: ExerciseStep = {
      id: generateId(),
      title: '',
      description: '',
      order: data.instructions.length,
    };
    onChange({ ...data, instructions: [...data.instructions, newStep] });
  };

  const updateStep = (stepId: string, updates: Partial<ExerciseStep>) => {
    onChange({
      ...data,
      instructions: data.instructions.map((s) => s.id === stepId ? { ...s, ...updates } : s),
    });
  };

  const deleteStep = (stepId: string) => {
    onChange({ ...data, instructions: data.instructions.filter((s) => s.id !== stepId) });
  };

  const addResource = () => {
    const newResource: ExerciseResource = {
      id: generateId(),
      title: '',
      url: '',
      type: 'link',
    };
    onChange({ ...data, requiredResources: [...data.requiredResources, newResource] });
  };

  const updateResource = (resourceId: string, updates: Partial<ExerciseResource>) => {
    onChange({
      ...data,
      requiredResources: data.requiredResources.map((r) => r.id === resourceId ? { ...r, ...updates } : r),
    });
  };

  const deleteResource = (resourceId: string) => {
    onChange({ ...data, requiredResources: data.requiredResources.filter((r) => r.id !== resourceId) });
  };

  const addCriterion = () => {
    const newCriterion: EvaluationCriterion = {
      id: generateId(),
      criterion: '',
      points: 1,
    };
    onChange({ ...data, evaluationCriteria: [...data.evaluationCriteria, newCriterion] });
  };

  const updateCriterion = (criterionId: string, updates: Partial<EvaluationCriterion>) => {
    onChange({
      ...data,
      evaluationCriteria: data.evaluationCriteria.map((c) => c.id === criterionId ? { ...c, ...updates } : c),
    });
  };

  const deleteCriterion = (criterionId: string) => {
    onChange({ ...data, evaluationCriteria: data.evaluationCriteria.filter((c) => c.id !== criterionId) });
  };

  const totalPoints = data.evaluationCriteria.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Exercício</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tempo Estimado (minutos)</Label>
              <Input
                type="number"
                value={data.estimatedMinutes}
                onChange={(e) => onChange({ ...data, estimatedMinutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Dificuldade</Label>
              <Select
                value={data.difficulty}
                onValueChange={(value: any) => onChange({ ...data, difficulty: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Instruções ({data.instructions.length})</CardTitle>
            <Button onClick={addStep}><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.instructions.map((step, i) => (
            <Card key={step.id}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <GripVertical className="h-5 w-5 mt-2" />
                  <div className="flex-1 space-y-3">
                    <Badge>Passo {i + 1}</Badge>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(step.id, { title: e.target.value })}
                      placeholder="Título"
                    />
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      placeholder="Descrição"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteStep(step.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Recursos ({data.requiredResources.length})</CardTitle>
            <Button onClick={addResource}><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.requiredResources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={resource.title}
                      onChange={(e) => updateResource(resource.id, { title: e.target.value })}
                      placeholder="Título"
                    />
                    <Input
                      value={resource.url}
                      onChange={(e) => updateResource(resource.id, { url: e.target.value })}
                      placeholder="URL"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteResource(resource.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Critérios de Avaliação</CardTitle>
              <CardDescription>Total: {totalPoints} pontos</CardDescription>
            </div>
            <Button onClick={addCriterion}><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.evaluationCriteria.map((criterion) => (
            <div key={criterion.id} className="flex gap-3">
              <Input
                value={criterion.criterion}
                onChange={(e) => updateCriterion(criterion.id, { criterion: e.target.value })}
                placeholder="Critério"
                className="flex-1"
              />
              <Input
                type="number"
                value={criterion.points}
                onChange={(e) => updateCriterion(criterion.id, { points: parseInt(e.target.value) })}
                className="w-24"
              />
              <Button variant="ghost" size="sm" onClick={() => deleteCriterion(criterion.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
