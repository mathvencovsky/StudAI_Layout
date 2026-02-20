import { createStub } from "./base-stub";

export interface Content {
  id: string;
  title: string;
  type: "youtube_video" | "article" | "quiz" | "assignment" | "lab";
  thumbnail_url?: string;
  link: string;
  duration_in_seconds: number;
  author?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export async function getContentsStub(type?: string): Promise<Content[]> {
  const allContents: Content[] = [
    {
      id: "1",
      title: "Introduction to React Hooks",
      type: "youtube_video",
      link: "https://youtube.com/watch?v=example1",
      duration_in_seconds: 1200,
      author: "React Team",
      level: "beginner",
    },
    {
      id: "2",
      title: "TypeScript Best Practices",
      type: "article",
      link: "https://example.com/typescript-best-practices",
      duration_in_seconds: 600,
      author: "TypeScript Docs",
      level: "intermediate",
    },
    {
      id: "3",
      title: "JavaScript ES6 Quiz",
      type: "quiz",
      link: "/quiz/js-es6",
      duration_in_seconds: 900,
      level: "intermediate",
    },
    {
      id: "4",
      title: "Advanced React Patterns",
      type: "youtube_video",
      link: "https://youtube.com/watch?v=example2",
      duration_in_seconds: 1800,
      author: "Kent C. Dodds",
      level: "advanced",
    },
    {
      id: "5",
      title: "CSS Grid Layout Guide",
      type: "article",
      link: "https://example.com/css-grid",
      duration_in_seconds: 480,
      author: "CSS Tricks",
      level: "beginner",
    },
  ];

  if (type && type !== "all") {
    return createStub(allContents.filter((c) => c.type === type));
  }

  return createStub(allContents);
}
