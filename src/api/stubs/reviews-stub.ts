import { createStub } from "./base-stub";

export interface ReviewItem {
  id: string;
  contentId: string;
  contentTitle: string;
  dueDate: string;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "completed";
  category: "today" | "this-week" | "completed";
}

export async function getReviewsStub(
  category?: "today" | "this-week" | "completed",
): Promise<ReviewItem[]> {
  const allReviews: ReviewItem[] = [
    {
      id: "1",
      contentId: "c1",
      contentTitle: "React Hooks - useState",
      dueDate: new Date().toISOString(),
      difficulty: "medium",
      status: "pending",
      category: "today",
    },
    {
      id: "2",
      contentId: "c2",
      contentTitle: "TypeScript Generics",
      dueDate: new Date().toISOString(),
      difficulty: "hard",
      status: "pending",
      category: "today",
    },
    {
      id: "3",
      contentId: "c3",
      contentTitle: "JavaScript Promises",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      difficulty: "easy",
      status: "pending",
      category: "this-week",
    },
    {
      id: "4",
      contentId: "c4",
      contentTitle: "CSS Flexbox",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      difficulty: "easy",
      status: "completed",
      category: "completed",
    },
  ];

  if (category) {
    return createStub(allReviews.filter((r) => r.category === category));
  }

  return createStub(allReviews);
}

export async function completeReviewStub(reviewId: string): Promise<ReviewItem> {
  return createStub({
    id: reviewId,
    contentId: "c1",
    contentTitle: "React Hooks - useState",
    dueDate: new Date().toISOString(),
    difficulty: "medium" as const,
    status: "completed" as const,
    category: "completed" as const,
  });
}
