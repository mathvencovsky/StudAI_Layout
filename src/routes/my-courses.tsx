import { createFileRoute } from "@tanstack/react-router";
import { MyCoursesPage } from "@/components/course-builder/my-courses-page";

export const Route = createFileRoute("/my-courses")({
  component: MyCoursesPage,
});
