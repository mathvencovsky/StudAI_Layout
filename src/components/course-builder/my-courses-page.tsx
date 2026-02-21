import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListCourses } from "@/hooks/course/use-list-courses";
import { useListUserCourses } from "@/hooks/user-course/use-list-user-courses";
import {
  BookOpen,
  Clock,
  Plus,
  Loader2,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function MyCoursesPage() {
  const { t } = useTranslation();
  const { data: courses, isLoading: isLoadingCourses } = useListCourses();
  const { data: userCourses, isLoading: isLoadingUserCourses } =
    useListUserCourses();

  const isLoading = isLoadingCourses || isLoadingUserCourses;

  const myCourses = courses?.filter((c) => c.owner) || [];

  const getEnrollmentStatus = (courseId: string) => {
    return userCourses?.find((uc) => uc.courseId === courseId);
  };

  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "published": return t("pages-my-courses-status-published");
      case "draft": return t("pages-my-courses-status-draft");
      default: return t("pages-my-courses-status-archived");
    }
  };

  const getLevelLabel = (level: string | null | undefined) => {
    switch (level) {
      case "beginner": return t("pages-my-courses-level-beginner");
      case "intermediate": return t("pages-my-courses-level-intermediate");
      default: return t("pages-my-courses-level-advanced");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("pages-my-courses-title")}</h1>
          <p className="text-gray-600">
            {t("pages-my-courses-description")}
          </p>
        </div>
        <Link to="/create-course">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("pages-my-courses-create-new")}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : myCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">{t("pages-my-courses-no-courses")}</h3>
          <p className="text-gray-600 mb-6">
            {t("pages-my-courses-no-courses-description")}
          </p>
          <Link to="/create-course">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("pages-my-courses-create-first")}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => {
            const enrollment = getEnrollmentStatus(course.id);
            const modules = Array.isArray(course.modules) ? course.modules : [];

            return (
              <Link
                key={course.id}
                to="/course/$courseId"
                params={{ courseId: course.id }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {course.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={
                        course.status === "published"
                          ? "bg-green-100 text-green-800"
                          : course.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {getStatusLabel(course.status)}
                    </Badge>
                    {course.level && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {getLevelLabel(course.level)}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{t("pages.my-courses.modules-count", { count: modules.length })}</span>
                    </div>
                    {course.estimatedHours && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{t("pages.my-courses.estimated-hours", { hours: course.estimatedHours })}</span>
                      </div>
                    )}
                  </div>

                  {enrollment && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t("pages-my-courses-progress")}</span>
                        <span className="text-sm text-gray-600">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          {enrollment.xpEarned} XP
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          {t("pages.my-courses.streak-days", { days: enrollment.streak })}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
