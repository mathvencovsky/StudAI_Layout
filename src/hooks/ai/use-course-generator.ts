import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateCourse,
  validateCourse,
  type CourseGenerationInput,
  type GeneratedCourse,
} from "@/lib/ai/course-generator";
import { checkPlanLimit, incrementUsage } from "@/lib/ai/plan-guard";
import { createCourse } from "@/api/course";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Hook to generate a course with AI
 * Includes plan limit checking and usage tracking
 */
export const useGenerateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CourseGenerationInput) => {
      // 1. Get user ID
      const session = await fetchAuthSession();
      const userId = session.userSub;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // 2. Check plan limit
      const guardResult = await checkPlanLimit(userId, "course_builder");
      if (!guardResult.allowed) {
        throw guardResult.error;
      }

      // 3. Generate course
      const course = await generateCourse(input);

      // 4. Validate course
      const validation = validateCourse(course);
      if (!validation.valid) {
        throw new Error(`Invalid course: ${validation.errors.join(", ")}`);
      }

      // 5. Increment usage (estimate tokens)
      const estimatedTokensIn = 1000;
      const estimatedTokensOut = 2000;
      await incrementUsage(
        userId,
        "course_builder",
        estimatedTokensIn,
        estimatedTokensOut
      );

      return course;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["plan-guard"] });
    },
  });
};

/**
 * Hook to save generated course to database
 */
export const useSaveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      course,
      status = "draft",
    }: {
      course: GeneratedCourse;
      status?: "draft" | "published";
    }) => {
      // Convert GeneratedCourse to Course model
      const courseData = {
        title: course.title,
        summary: course.summary,
        category: course.category,
        level: course.level,
        estimatedHours: course.estimatedHours,
        modules: course.modules,
        status,
        publishedAt: status === "published" ? Date.now() : undefined,
      };

      return await createCourse(courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * Hook to generate and save course in one step
 */
export const useGenerateAndSaveCourse = () => {
  const generateMutation = useGenerateCourse();
  const saveMutation = useSaveCourse();

  return useMutation({
    mutationFn: async (input: CourseGenerationInput) => {
      // 1. Generate course
      const course = await generateMutation.mutateAsync(input);

      // 2. Save as draft
      const savedCourse = await saveMutation.mutateAsync({
        course,
        status: "draft",
      });

      return { course, savedCourse };
    },
  });
};
