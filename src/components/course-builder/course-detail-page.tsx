import { useParams, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCourse } from "@/hooks/course/use-course";
import { useListUserCourses } from "@/hooks/user-course/use-list-user-courses";
import { useCreateUserCourse } from "@/hooks/user-course/use-create-user-course";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Play,
  ArrowLeft,
} from "lucide-react";

export function CourseDetailPage() {
  const { courseId } = useParams({ from: "/course/$courseId" });
  const { data: course, isLoading } = useCourse({ id: courseId });
  const { data: userCourses } = useListUserCourses();
  const createEnrollment = useCreateUserCourse();

  const enrollment = userCourses?.find((uc) => uc.courseId === courseId);
  const isEnrolled = !!enrollment;

  const handleEnroll = async () => {
    if (!course) return;

    try {
      await createEnrollment.mutateAsync({
        courseId: course.id,
        status: "in_progress",
        startDate: Date.now(),
        progress: 0,
        streak: 0,
        xpEarned: 0,
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12 text-center">
          <p className="text-gray-600">Curso não encontrado</p>
          <Link to="/my-courses">
            <Button className="mt-4">Back to My Courses</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Back Button */}
      <Link to="/my-courses">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      {/* Header */}
      <Card className="p-8 mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                className={
                  course.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {course.status === "published" ? "Publicado" : "Rascunho"}
              </Badge>
              {course.level && (
                <Badge className="bg-blue-100 text-blue-800">
                  {course.level === "beginner"
                    ? "Iniciante"
                    : course.level === "intermediate"
                    ? "Intermediário"
                    : "Avançado"}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-gray-700 text-lg">{course.summary}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{modules.length}</p>
            <p className="text-sm text-gray-600">Módulos</p>
          </div>
          <div className="text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">
              {modules.reduce((acc, m: any) => {
                const tasks = Array.isArray(m.tasks) ? m.tasks : [];
                return acc + tasks.length;
              }, 0)}
            </p>
            <p className="text-sm text-gray-600">Tarefas</p>
          </div>
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{course.estimatedHours || 0}h</p>
            <p className="text-sm text-gray-600">Duração</p>
          </div>
          <div className="text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">
              {modules.reduce((acc, m: any) => acc + (m.xpTotal || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">XP Total</p>
          </div>
        </div>

        {/* Enrollment Status */}
        {isEnrolled ? (
          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Seu Progresso</span>
              <span className="text-sm text-gray-600">
                {enrollment.progress}%
              </span>
            </div>
            <Progress value={enrollment.progress || 0} className="mb-3" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{enrollment.xpEarned} XP ganhos</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{enrollment.streak} dias de streak</span>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleEnroll}
            className="w-full mt-6"
            disabled={createEnrollment.isPending}
          >
            {createEnrollment.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Inscrevendo...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Começar Curso
              </>
            )}
          </Button>
        )}
      </Card>

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Conteúdo do Curso</h2>

        {modules.map((module: any, index: number) => {
          const lessons = Array.isArray(module.lessons) ? module.lessons : [];
          const tasks = Array.isArray(module.tasks) ? module.tasks : [];
          const goals = Array.isArray(module.goals) ? module.goals : [];

          return (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">{module.title}</h3>

                  {/* Goals */}
                  {goals.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-2">
                        Objetivos de Aprendizagem:
                      </p>
                      <ul className="space-y-2">
                        {goals.map((goal: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lessons */}
                  {lessons.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-2">
                        Aulas ({lessons.length}):
                      </p>
                      <div className="space-y-2">
                        {lessons.map((lesson: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">{lesson.title}</span>
                              <Badge className="text-xs">
                                {lesson.estimatedMinutes} min
                              </Badge>
                            </div>
                            {lesson.url && (
                              <a
                                href={lesson.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {tasks.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-2">
                        Tarefas Práticas ({tasks.length}):
                      </p>
                      <div className="space-y-2">
                        {tasks.map((task: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Target className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium">{task.title}</p>
                                {task.instructions && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {task.instructions}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {task.xp} XP
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-800">
                                {task.estimatedMinutes} min
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Module XP */}
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-4 pt-4 border-t">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Total: {module.xpTotal || 0} XP neste módulo</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
