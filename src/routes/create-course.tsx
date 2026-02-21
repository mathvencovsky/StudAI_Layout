import { createFileRoute } from "@tanstack/react-router";
import { CourseBuilderPage } from "@/components/course-builder/course-builder-page";

export const Route = createFileRoute("/create-course")({
  component: CourseBuilderPage,
});
