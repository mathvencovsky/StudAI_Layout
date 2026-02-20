import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { GeneratedCourse } from "@/lib/ai/course-generator";

interface CoursePreviewProps {
  course: GeneratedCourse;
}

export function CoursePreview({ course }: CoursePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700">{course.summary}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-purple-100 text-purple-800">
            {course.category}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            {course.level === "beginner"
              ? "Iniciante"
              : course.level === "intermediate"
              ? "Intermediário"
              : "Avançado"}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Clock className="h-3 w-3 mr-1" />
            {course.estimatedHours}h
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-purple-600" />
            <p className="text-2xl font-bold">{course.modules.length}</p>
            <p className="text-xs text-gray-600">Módulos</p>
          </div>
          <div className="text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-2xl font-bold">
              {course.modules.reduce((acc, m) => acc + m.tasks.length, 0)}
            </p>
            <p className="text-xs text-gray-600">Tarefas</p>
          </div>
          <div className="text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
            <p className="text-2xl font-bold">{course.badges.length}</p>
            <p className="text-xs text-gray-600">Badges</p>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <div>
        <h3 className="text-xl font-bold mb-4">Módulos do Curso</h3>
        <div className="space-y-4">
          {course.modules.map((module, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{module.title}</h4>

                  {/* Goals */}
                  {module.goals.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Objetivos:
                      </p>
                      <ul className="space-y-1">
                        {module.goals.map((goal, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lessons */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Aulas ({module.lessons.length}):
                    </p>
                    <div className="space-y-1">
                      {module.lessons.slice(0, 3).map((lesson, i) => (
                        <div
                          key={i}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <BookOpen className="h-3 w-3" />
                          {lesson.title}
                          {lesson.url && (
                            <ExternalLink className="h-3 w-3 text-blue-500" />
                          )}
                          <span className="text-xs text-gray-400">
                            ({lesson.estimatedMinutes} min)
                          </span>
                        </div>
                      ))}
                      {module.lessons.length > 3 && (
                        <p className="text-xs text-gray-500">
                          + {module.lessons.length - 3} aulas
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Tarefas ({module.tasks.length}):
                    </p>
                    <div className="space-y-1">
                      {module.tasks.slice(0, 2).map((task, i) => (
                        <div
                          key={i}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <Target className="h-3 w-3" />
                          {task.title}
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">
                            {task.xp} XP
                          </Badge>
                        </div>
                      ))}
                      {module.tasks.length > 2 && (
                        <p className="text-xs text-gray-500">
                          + {module.tasks.length - 2} tarefas
                        </p>
                      )}
                    </div>
                  </div>

                  {/* XP Total */}
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{module.xpTotal} XP</span>
                    <span className="text-gray-500">neste módulo</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Routine */}
      {course.dailyRoutine && (
        <Card className="p-6 bg-blue-50">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Rotina Diária Sugerida
          </h3>
          <p className="text-gray-700 mb-3">{course.dailyRoutine.description}</p>
          <ul className="space-y-2">
            {course.dailyRoutine.tasks.map((task, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                {task}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Badges */}
      {course.badges.length > 0 && (
        <Card className="p-6 bg-yellow-50">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Badges e Conquistas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.badges.map((badge, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {badge.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
