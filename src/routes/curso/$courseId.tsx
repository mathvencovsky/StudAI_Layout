import { createFileRoute } from "@tanstack/react-router";
import { CourseDetailPage } from "@/components/course-builder/course-detail-page";

export const Route = createFileRoute("/curso/$courseId")({
  component: CourseDetailPage,
});
